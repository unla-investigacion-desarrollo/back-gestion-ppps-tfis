/**
 * Archivo generado con NestJS CLI y luego modificado
 * para agregar funcionalidades especificas
 */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project, ProjectStatus } from './entities/project.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/users/entities/user.entity';
import { JwtPayload } from 'src/auth/types/jwt-payload.interface';
import { Professor } from 'src/users/entities/professor.entity';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ActiveProfessorProject } from './entities/active-professor-project.entity';
import { Student } from 'src/users/entities/student.entity';
import { ActiveStudentProject } from './entities/active-student-project.entity';
import { ProjectType } from './entities/project-type.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,

    @InjectRepository(Professor)
    private professorRepository: Repository<Professor>,

    @InjectRepository(ProjectType)
    private projectTypeRepository: Repository<ProjectType>,

    @InjectRepository(ActiveProfessorProject)
    private activeProfessorProjectRepository: Repository<ActiveProfessorProject>,

    @InjectRepository(Student)
    private studentRepository: Repository<Student>,

    @InjectRepository(ActiveStudentProject)
    private activeStudentProjectRepository: Repository<ActiveStudentProject>,
  ) {}

  async onModuleInit() {
    const defaultTypes = ['Development', 'Research', 'Extension', 'Other'];

    for (const name of defaultTypes) {
      const exists = await this.projectTypeRepository.findOne({
        where: { name },
      });
      if (!exists) {
        await this.projectTypeRepository.save(
          this.projectTypeRepository.create({ name }),
        );
      }
    }
  }

  async findAllProjectTypes() {
    return await this.projectTypeRepository.find({
      order: { id: 'ASC' },
    });
  }

  async create(createProjectDto: CreateProjectDto, user: JwtPayload) {
    if (user.role === Role.PROFESSOR) {
      const professor = await this.professorRepository.findOne({
        where: { id_user: user.id },
      });
      if (!professor) {
        throw new NotFoundException('Docente no encontrado');
      }
      if (professor.isTutor) {
        throw new ForbiddenException('Los tutores no pueden crear proyectos');
      }
    }

    if (createProjectDto.customProjectType) {
      const name = createProjectDto.customProjectType.trim();

      let projectType = await this.projectTypeRepository.findOne({
        where: { name },
      });

      if (!projectType) {
        projectType = await this.projectTypeRepository.save(
          this.projectTypeRepository.create({ name }),
        );
      }

      const project = this.projectsRepository.create({
        title: createProjectDto.title,
        description: createProjectDto.description,
        projectType,
      });

      return await this.projectsRepository.save(project);
    }

    // 2. Si eligió uno de la lista por ID:
    if (createProjectDto.projectTypeId) {
      const projectType = await this.projectTypeRepository.findOne({
        where: { id: +createProjectDto.projectTypeId },
      });

      if (!projectType) {
        throw new NotFoundException('Tipo de proyecto no encontrado');
      }

      const project = this.projectsRepository.create({
        title: createProjectDto.title,
        description: createProjectDto.description,
        projectType,
      });

      return await this.projectsRepository.save(project);
    }

    throw new NotFoundException('Debe indicar un tipo de proyecto válido');
  }

  async findAll(user: JwtPayload) {
    const projects = await this.projectsRepository.find({
      relations: [
        'activeProfessors',
        'activeProfessors.professor',
        'activeStudents',
        'activeStudents.student',
      ],
    });

    if (user.role === Role.ADMIN) {
      return projects;
    }

    if (user.role === Role.PROFESSOR) {
      const professor = await this.professorRepository.findOne({
        where: { id_user: user.id },
      });

      if (!professor) {
        throw new ForbiddenException('Profesor no encontrado');
      }

      if (!professor.isTutor) {
        return projects;
      }

      return projects.map((project) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        projectType: project.projectType,
      }));
    }

    if (user.role === Role.STUDENT) {
      return projects.map((project) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        projectType: project.projectType,
      }));
    }

    throw new ForbiddenException('Rol no autorizado');
  }

  async findOne(id: number, user: JwtPayload) {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: [
        'activeProfessors',
        'activeProfessors.professor',
        'activeStudents',
        'activeStudents.student',
      ],
    });

    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    if (user.role === Role.ADMIN) {
      return project;
    }

    if (user.role === Role.PROFESSOR) {
      const professor = await this.professorRepository.findOne({
        where: { id_user: user.id },
      });

      if (!professor) {
        throw new ForbiddenException('Profesor no encontrado');
      }

      // Evaluador ve todo
      if (!professor.isTutor) {
        return project;
      }

      const isAssignedAndActive = project.activeProfessors.some(
        (ap) => ap.professor.id_user === user.id && ap.active === true,
      );
      if (!isAssignedAndActive) {
        throw new ForbiddenException('No tienes acceso a este proyecto');
      }
      return project;
    }

    if (user.role === Role.STUDENT) {
      const isAssignedAndActive = project.activeStudents.some(
        (as) => as.student.id_user === user.id && as.active === true,
      );
      if (!isAssignedAndActive) {
        throw new ForbiddenException('No tienes acceso a este proyecto');
      }
      return project;
    }
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
    user: JwtPayload,
  ) {
    const project = await this.projectsRepository.findOneBy({ id: id });
    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    if (user.role === Role.PROFESSOR) {
      const professor = await this.professorRepository.findOne({
        where: { id_user: user.id },
      });
      if (!professor) throw new NotFoundException('Docente no encontrado');
      if (professor.isTutor) {
        throw new ForbiddenException(
          'Los tutores no pueden modificar proyectos',
        );
      }
    }

    if (updateProjectDto.projectTypeId) {
      const projectType = await this.projectTypeRepository.findOne({
        where: { id: +updateProjectDto.projectTypeId },
      });
      if (!projectType) {
        throw new NotFoundException('Tipo de proyecto no encontrado');
      }
      project.projectType = projectType;
    }

    Object.assign(project, updateProjectDto);
    await this.projectsRepository.save(project);

    return { message: 'Proyecto actualizado correctamente', project };
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async requestJoinAsProfessor(id: number, user: JwtPayload) {
    const project = await this.projectsRepository.findOne({
      where: { id: id },
    });

    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    const professor = await this.professorRepository.findOne({
      where: { id_user: user.id },
    });

    if (!professor) throw new NotFoundException('Profesor no encontrado');

    if (!professor?.isTutor) {
      throw new ForbiddenException(
        'Solo tutores pueden solicitar unirse a un proyecto',
      );
    }

    const existingRelation =
      await this.activeProfessorProjectRepository.findOne({
        where: {
          professor: { id_user: user.id },
          project: { id: id },
        },
      });

    if (existingRelation) {
      throw new ForbiddenException('Ya enviaste solicitud para este proyecto');
    }

    const relation = this.activeProfessorProjectRepository.create({
      professor,
      project,
      active: false,
    });
    await this.activeProfessorProjectRepository.save(relation);

    return { message: 'Solicitud enviada correctamente' };
  }

  async requestJoinAsStudent(id: number, user: JwtPayload) {
    const project = await this.projectsRepository.findOne({
      where: { id: id },
    });

    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    const student = await this.studentRepository.findOne({
      where: { id_user: user.id },
    });

    if (!student) throw new NotFoundException('Estudiante no encontrado');

    const activeCount = await this.activeStudentProjectRepository.count({
      where: { student: { id_user: user.id }, active: true },
    });

    if (activeCount >= 2) {
      throw new ForbiddenException(
        'Ya estás participando en el maximo de 2 proyectos activos',
      );
    }

    const existingRelation = await this.activeStudentProjectRepository.findOne({
      where: {
        student: { id_user: user.id },
        project: { id: id },
      },
    });

    if (existingRelation) {
      throw new ForbiddenException('Ya enviaste solicitud para este proyecto');
    }

    const relation = this.activeStudentProjectRepository.create({
      student,
      project,
      active: false,
    });
    await this.activeStudentProjectRepository.save(relation);

    return { message: 'Solicitud enviada correctamente' };
  }

  async approveStudentRequest(
    id: number,
    studentRequestId: number,
    user: JwtPayload,
  ) {
    if (user.role === Role.PROFESSOR) {
      const professor = await this.professorRepository.findOne({
        where: { id_user: user.id },
      });

      if (!professor) {
        throw new NotFoundException('Profesor no encontrado');
      }

      if (professor.isTutor) {
        throw new ForbiddenException(
          'Solo docentes evaluadores pueden aprobar solicitudes',
        );
      }
    }

    const request = await this.activeStudentProjectRepository.findOne({
      where: {
        student: { id_user: studentRequestId },
        project: { id: id },
        active: false,
      },
      relations: ['student', 'project'],
    });

    if (!request) {
      throw new NotFoundException('Solicitud no encontrada o ya aprobada');
    }

    request.active = true;
    await this.activeStudentProjectRepository.save(request);

    const project = await this.projectsRepository.findOneBy({ id });
    if (project && project.status === ProjectStatus.PENDING) {
      project.status = ProjectStatus.IN_PROGRESS;
      await this.projectsRepository.save(project);
    }
    return { message: 'Solicitud aprobada correctamente' };
  }

  async rejectStudentRequest(
    id: number,
    studentRequestId: number,
    user: JwtPayload,
  ) {
    if (user.role === Role.PROFESSOR) {
      const professor = await this.professorRepository.findOne({
        where: { id_user: user.id },
      });

      if (!professor) {
        throw new NotFoundException('Profesor no encontrado');
      }

      if (professor.isTutor) {
        throw new ForbiddenException(
          'Solo docentes evaluadores pueden rechazar solicitudes',
        );
      }
    }

    const request = await this.activeStudentProjectRepository.findOne({
      where: {
        student: { id_user: studentRequestId },
        project: { id: id },
      },
    });

    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    await this.activeStudentProjectRepository.remove(request);
    return { message: 'Solicitud rechazada y eliminada' };
  }

  async approveProfessorRequest(
    id: number,
    professorRequestId: number,
    user: JwtPayload,
  ) {
    if (user.role === Role.PROFESSOR) {
      const professor = await this.professorRepository.findOne({
        where: { id_user: user.id },
      });

      if (!professor) throw new NotFoundException('Profesor no encontrado');

      if (professor.isTutor) {
        throw new ForbiddenException(
          'Solo docentes evaluadores pueden aprobar una solicitud',
        );
      }
    }

    const request = await this.activeProfessorProjectRepository.findOne({
      where: {
        professor: { id_user: professorRequestId },
        project: { id: id },
        active: false,
      },
      relations: ['professor', 'project'],
    });

    if (!request) {
      throw new NotFoundException('Solicitud no encontrada o ya aprobada');
    }

    request.active = true;

    await this.activeProfessorProjectRepository.save(request);

    const project = await this.projectsRepository.findOneBy({ id });
    if (project && project.status === ProjectStatus.PENDING) {
      project.status = ProjectStatus.IN_PROGRESS;
      await this.projectsRepository.save(project);
    }

    return { message: 'Solicitud aprobada correctamente' };
  }

  async rejectProfessorRequest(
    id: number,
    professorRequestId: number,
    user: JwtPayload,
  ) {
    if (user.role === Role.PROFESSOR) {
      const professor = await this.professorRepository.findOne({
        where: { id_user: user.id },
      });

      if (!professor) throw new NotFoundException('Profesor no encontrado');

      if (professor.isTutor) {
        throw new ForbiddenException(
          'Solo docentes evaluadores pueden rechazar una solicitud',
        );
      }
    }
    const request = await this.activeProfessorProjectRepository.findOne({
      where: {
        professor: { id_user: professorRequestId },
        project: { id: id },
      },
    });

    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    await this.activeProfessorProjectRepository.remove(request);
    return { message: 'Solicitud rechazada y eliminada' };
  }

  async getMyRequests(user: JwtPayload) {
    if (user.role === Role.STUDENT) {
      return await this.activeStudentProjectRepository.find({
        where: { student: { id_user: user.id }, active: false },
        relations: ['project'],
      });
    }

    if (user.role === Role.PROFESSOR) {
      const professor = await this.professorRepository.findOne({
        where: { id_user: user.id },
      });

      if (!professor) {
        throw new NotFoundException('Profesor no encontrado');
      }

      if (!professor.isTutor) {
        throw new ForbiddenException(
          'Solo los tutores pueden tener solicitudes pendientes',
        );
      }

      return await this.activeProfessorProjectRepository.find({
        where: { professor: { id_user: user.id }, active: false },
        relations: ['project'],
      });
    }
  }

  async getMyActiveProjects(user: JwtPayload) {
    if (user.role === Role.STUDENT) {
      return await this.activeStudentProjectRepository.find({
        where: { student: { id_user: user.id }, active: true },
        relations: ['project'],
      });
    }

    if (user.role === Role.PROFESSOR) {
      const professor = await this.professorRepository.findOne({
        where: { id_user: user.id },
      });

      if (!professor) {
        throw new NotFoundException('Profesor no encontrado');
      }

      if (!professor.isTutor) {
        throw new ForbiddenException(
          'Solo los docentes tutores pueden ver sus proyectos activos',
        );
      }

      return await this.activeProfessorProjectRepository.find({
        where: { professor: { id_user: user.id }, active: true },
        relations: ['project'],
      });
    }
  }
}
