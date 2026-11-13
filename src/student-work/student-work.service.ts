import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentWork, StudentWorkStatus } from './entities/student-work.entity';
import { Project } from 'src/project/entities/project.entity';
import { Professor } from 'src/users/entities/professor.entity';
import { Student } from 'src/users/entities/student.entity';
import { CreateStudentWorkDto } from './dto/create-student-work.dto';
import { QualifyWorkDto } from './dto/qualify-work.dto';
import { Role } from 'src/users/entities/user.entity';
import { JwtPayload } from 'src/auth/types/jwt-payload.interface';
import { UpdateStudentWorkDto } from './dto/update-student-work.dto';
import { ActiveStudentProject } from 'src/project/entities/active-student-project.entity';
import { QualificationResponse } from './interfaces/qualification-response.interface';

@Injectable()
export class StudentWorkService {
  constructor(
    @InjectRepository(StudentWork)
    private readonly workRepository: Repository<StudentWork>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(ActiveStudentProject)
    private readonly activeStudentProjectRepository: Repository<ActiveStudentProject>,
  ) {}

  async findAll(status?: StudentWorkStatus) {
    const where = status ? { status } : {};
    return await this.workRepository.find({
      where,
      relations: [
        'project',
        'project.activeStudents',
        'project.activeStudents.student',
        'project.activeStudents.student.user',
        'lastReviewedBy',
        'lastReviewedBy.user',
      ],
    });
  }

  async create(projectId: number, createStudentWorkDto: CreateStudentWorkDto) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    const existingWork = await this.workRepository.findOne({
      where: { project: { id: projectId } },
    });
    if (existingWork) {
      throw new ConflictException(
        'Este proyecto ya posee una entrega registrada',
      );
    }

    const work = this.workRepository.create({
      documentUrl: createStudentWorkDto.documentUrl,
      driveFolderUrl: createStudentWorkDto.driveFolderUrl || null,
      project: project,
      status: StudentWorkStatus.PENDING_REVIEW,
    });

    const savedWork = await this.workRepository.save(work);

    return {
      message: 'Entrega registrada con éxito',
      workId: savedWork.id,
      projectId: project.id,
      status: savedWork.status,
    };
  }

  async findOneByProject(projectId: number, user: JwtPayload) {
    let isEvaluator = false;
    let isTutor = false;

    if (user.role === Role.PROFESSOR) {
      const professor = await this.professorRepository.findOne({
        where: { id_user: user.id },
      });
      if (professor) {
        if (professor.isTutor) {
          isTutor = true;
        } else {
          isEvaluator = true;
        }
      }
    }

    if (isEvaluator) {
      const work = await this.workRepository.findOne({
        where: { project: { id: projectId } },
        relations: ['project', 'lastReviewedBy', 'lastReviewedBy.user'],
      });

      if (!work) throw new NotFoundException('Entrega no encontrada');

      return {
        id: work.id,
        documentUrl: work.documentUrl,
        status: work.status,
        qualification: work.qualification,
        project: {
          id: work.project.id,
          description: work.project.description,
          status: work.project.status,
        },
        lastReviewedAt: work.lastReviewedAt,
        reviewedBy: work.lastReviewedBy?.user
          ? {
              id: work.lastReviewedBy.user.id,
              firstName: work.lastReviewedBy.user.firstName,
              lastName: work.lastReviewedBy.user.lastName,
            }
          : null,
        createdAt: work.createdAt,
        updatedAt: work.updatedAt,
      };
    }

    if (isTutor) {
      const work = await this.workRepository.findOne({
        where: { project: { id: projectId } },
        relations: ['project', 'lastTutoredBy', 'lastTutoredBy.user'],
      });

      if (!work) throw new NotFoundException('Entrega no encontrada');

      return {
        id: work.id,
        documentUrl: work.documentUrl,
        driveFolderUrl: work.driveFolderUrl,
        tutoringRequested: work.tutoringRequested,
        lastTutoredAt: work.lastTutoredAt,
        project: {
          id: work.project.id,
          description: work.project.description,
          status: work.project.status,
        },
        tutoredBy: work.lastTutoredBy?.user
          ? {
              id: work.lastTutoredBy.user.id,
              firstName: work.lastTutoredBy.user.firstName,
              lastName: work.lastTutoredBy.user.lastName,
            }
          : null,
      };
    }

    const work = await this.workRepository.findOne({
      where: { project: { id: projectId } },
      relations: [
        'project',
        'lastReviewedBy',
        'lastReviewedBy.user',
        'lastTutoredBy',
        'lastTutoredBy.user',
      ],
    });

    if (!work) throw new NotFoundException('Entrega no encontrada');

    return {
      id: work.id,
      documentUrl: work.documentUrl,
      driveFolderUrl: work.driveFolderUrl,
      status: work.status,
      qualification: work.qualification,
      project: {
        id: work.project.id,
        description: work.project.description,
        status: work.project.status,
      },
      lastReviewedAt: work.lastReviewedAt,
      reviewedBy: work.lastReviewedBy?.user
        ? {
            id: work.lastReviewedBy.user.id,
            firstName: work.lastReviewedBy.user.firstName,
            lastName: work.lastReviewedBy.user.lastName,
          }
        : null,
      tutoringRequested: work.tutoringRequested,
      lastTutoredAt: work.lastTutoredAt,
      tutoredBy: work.lastTutoredBy?.user
        ? {
            id: work.lastTutoredBy.user.id,
            firstName: work.lastTutoredBy.user.firstName,
            lastName: work.lastTutoredBy.user.lastName,
          }
        : null,
      createdAt: work.createdAt,
      updatedAt: work.updatedAt,
    };
  }

  async markAsObserved(workId: number, user: JwtPayload) {
    const professor = await this.professorRepository.findOne({
      where: { id_user: user.id },
      relations: ['user'],
    });

    if (!professor) {
      throw new ForbiddenException(
        'Solo los profesores pueden realizar observaciones formales',
      );
    }

    if (professor.isTutor) {
      throw new ForbiddenException(
        'Los tutores no realizan observaciones formales de cátedra',
      );
    }

    const work = await this.workRepository.findOne({ where: { id: workId } });
    if (!work) {
      throw new NotFoundException('Entrega no encontrada');
    }

    if (work.status === StudentWorkStatus.OBSERVED) {
      throw new BadRequestException(
        'Esta entrega ya se encuentra marcada con observaciones',
      );
    }

    if (work.status === StudentWorkStatus.APPROVED) {
      throw new BadRequestException(
        'No se pueden hacer observaciones sobre una entrega ya aprobada',
      );
    }

    work.status = StudentWorkStatus.OBSERVED;
    work.lastReviewedBy = professor;
    work.lastReviewedAt = new Date();

    await this.workRepository.save(work);

    return {
      message: 'Entrega marcada con observaciones exitosamente',
      workId: work.id,
      status: work.status,
      lastReviewedAt: work.lastReviewedAt,
      reviewedBy: {
        id: professor.user.id,
        firstName: professor.user.firstName,
        lastName: professor.user.lastName,
      },
    };
  }

  async notifyAdvances(workId: number) {
    const work = await this.workRepository.findOne({ where: { id: workId } });
    if (!work) {
      throw new NotFoundException('Entrega no encontrada');
    }

    if (work.status === StudentWorkStatus.PENDING_REVIEW) {
      throw new BadRequestException(
        'La entrega ya se encuentra pendiente de revisión por la cátedra',
      );
    }

    if (work.status === StudentWorkStatus.APPROVED) {
      throw new BadRequestException(
        'No se pueden notificar avances sobre una entrega ya aprobada',
      );
    }

    work.status = StudentWorkStatus.PENDING_REVIEW;
    await this.workRepository.save(work);

    return {
      message: 'Avances notificados a la cátedra con éxito',
      workId: work.id,
      status: work.status,
    };
  }

  async requestTutoring(workId: number) {
    const work = await this.workRepository.findOne({ where: { id: workId } });
    if (!work) throw new NotFoundException('Entrega no encontrada');

    if (work.tutoringRequested) {
      throw new BadRequestException(
        'Ya existe una solicitud de tutoría pendiente',
      );
    }

    work.tutoringRequested = true;
    await this.workRepository.save(work);

    return {
      message: 'Solicitud de tutoría enviada al tutor exitosamente',
      workId: work.id,
      tutoringRequested: work.tutoringRequested,
    };
  }

  async markAsTutored(workId: number, user: JwtPayload) {
    const professor = await this.professorRepository.findOne({
      where: { id_user: user.id },
      relations: ['user'],
    });

    if (!professor) {
      throw new ForbiddenException(
        'Solo los profesores pueden registrar tutorías',
      );
    }

    if (!professor.isTutor) {
      throw new ForbiddenException(
        'Solo los tutores asignados pueden registrar tutorías',
      );
    }

    const work = await this.workRepository.findOne({ where: { id: workId } });
    if (!work) {
      throw new NotFoundException('Entrega no encontrada');
    }

    if (!work.tutoringRequested) {
      throw new BadRequestException(
        'No hay una solicitud de tutoría pendiente para esta entrega',
      );
    }

    work.tutoringRequested = false;
    work.lastTutoredBy = professor;
    work.lastTutoredAt = new Date();

    await this.workRepository.save(work);

    return {
      message: 'Tutoría registrada con éxito',
      workId: work.id,
      tutoringRequested: work.tutoringRequested,
      lastTutoredAt: work.lastTutoredAt,
      tutoredBy: {
        id: professor.user.id,
        firstName: professor.user.firstName,
        lastName: professor.user.lastName,
      },
    };
  }

  async qualify(workId: number, qualifyDto: QualifyWorkDto, user: JwtPayload) {
    let professor: Professor | null = null;

    if (user.role === Role.PROFESSOR) {
      professor = await this.professorRepository.findOne({
        where: { id_user: user.id },
      });

      if (!professor) {
        throw new NotFoundException('Docente no encontrado');
      }

      if (professor.isTutor) {
        throw new ForbiddenException('Los tutores no pueden calificar');
      }
    }

    const work = await this.workRepository.findOne({
      where: { id: workId },
      relations: ['project', 'project.activeStudents'],
    });

    if (!work) {
      throw new NotFoundException('Entrega no encontrada');
    }

    if (
      !work.project ||
      !work.project.activeStudents ||
      work.project.activeStudents.length === 0
    ) {
      throw new BadRequestException(
        'No se puede calificar un proyecto que no posee estudiantes asignados',
      );
    }

    const hasActiveStudents = work.project.activeStudents.some(
      (as) => as.active === true,
    );

    if (!hasActiveStudents) {
      throw new BadRequestException(
        'No se puede calificar un proyecto que no posee estudiantes activos asignados',
      );
    }

    const { qualification } = qualifyDto;
    work.qualification = qualification;
    work.status =
      qualification === 0
        ? StudentWorkStatus.ABSENT
        : qualification >= 4
          ? StudentWorkStatus.APPROVED
          : StudentWorkStatus.DISAPPROVED;

    if (professor) {
      work.lastReviewedBy = professor;
    }
    work.lastReviewedAt = new Date();

    await this.workRepository.save(work);
    return {
      message: 'Calificación registrada exitosamente',
      workId: work.id,
      projectId: work.project.id,
      qualification: work.qualification,
      status: work.status,
      lastReviewedAt: work.lastReviewedAt,
    };
  }

  async updateUrls(
    workId: number,
    updateDto: UpdateStudentWorkDto,
    user: JwtPayload,
  ) {
    const work = await this.workRepository.findOne({
      where: { id: workId },
      relations: ['project'],
    });

    if (!work) {
      throw new NotFoundException('Entrega no encontrada');
    }

    if (user.role === Role.STUDENT) {
      if (work.status === StudentWorkStatus.APPROVED) {
        throw new BadRequestException(
          'No se pueden editar los enlaces de una entrega ya aprobada',
        );
      }
    }

    if (updateDto.documentUrl !== undefined) {
      work.documentUrl = updateDto.documentUrl;
    }
    if (updateDto.driveFolderUrl !== undefined) {
      work.driveFolderUrl = updateDto.driveFolderUrl;
    }

    await this.workRepository.save(work);

    return {
      message: 'Enlaces de la entrega actualizados con éxito',
      workId: work.id,
      documentUrl: work.documentUrl,
      driveFolderUrl: work.driveFolderUrl,
    };
  }

  async findAllQualifications(user: JwtPayload) {
    if (user.role === Role.PROFESSOR) {
      const professor = await this.professorRepository.findOne({
        where: { id_user: user.id },
      });

      if (!professor) {
        throw new ForbiddenException('Docente no encontrado');
      }

      if (professor.isTutor) {
        throw new ForbiddenException(
          'Los tutores no tienen acceso al listado de calificaciones',
        );
      }
    }
    const works = await this.workRepository.find({
      relations: [
        'project',
        'project.activeStudents',
        'project.activeStudents.student',
        'project.activeStudents.student.user',
      ],
    });

    const lista: QualificationResponse[] = [];

    for (const work of works) {
      for (const activeStudent of work.project.activeStudents) {
        if (activeStudent.active) {
          lista.push({
            firstName: activeStudent.student.user.firstName,
            lastName: activeStudent.student.user.lastName,
            dni: activeStudent.student.user.dni,
            email: activeStudent.student.user.email,
            status: work.status,
            qualification: work.qualification,
          });
        }
      }
    }

    return lista;
  }
}
