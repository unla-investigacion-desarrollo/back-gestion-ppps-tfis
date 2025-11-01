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
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/users/entities/user.entity';
import { JwtPayload } from 'src/auth/types/jwt-payload.interface';
import { Professor } from 'src/users/entities/professor.entity';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,

    @InjectRepository(Professor)
    private professorRepository: Repository<Professor>,
  ) {}

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
    const project = this.projectsRepository.create(createProjectDto);
    return await this.projectsRepository.save(project);
  }

  async findAll() {
    return await this.projectsRepository.find({
      relations: ['activeProfessors', 'activeStudents'],
    });
  }

  async findOne(id: number, user: JwtPayload) {
    const project = await this.projectsRepository.findOne({
      where: { id: id },
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
      const isAssigned = project.activeProfessors.some(
        (ap) => ap.professor.id_user === user.id,
      );
      if (!isAssigned) {
        throw new ForbiddenException('No tienes acceso a este proyecto');
      }
      return project;
    }
    if (user.role === Role.STUDENT) {
      const isAssigned = project.activeStudents.some(
        (as) => as.student.id_user === user.id,
      );
      if (!isAssigned) {
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
    Object.assign(project, updateProjectDto);
    await this.projectsRepository.save(project);

    return { message: 'Proyecto actualizado correctamente', project };
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
