/**
 * Archivo generado con NestJS CLI y luego modificado
 * para agregar funcionalidades especificas
 */

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ppp, PppStatus, PppType } from './entities/ppp.entity';
import { PppProposal } from './entities/ppp-proposal.entity';
import { Student } from 'src/users/entities/student.entity';
import { Professor } from 'src/users/entities/professor.entity';
import { CreatePppProposalDto } from './dto/create-ppp-proposal.dto';
import { ApplyProposalDto } from './dto/apply-ppp.dto';
import { Role } from 'src/users/entities/user.entity';
import { JwtPayload } from 'src/auth/types/jwt-payload.interface';
import { UpdateProposalStatusDto } from './dto/update-proposal-status.dto';
import { UpdatePppSettingDto } from './dto/update-ppp-setting.dto';
import { PppSetting } from './entities/ppp-setting.entity';

@Injectable()
export class PppService {
  constructor(
    @InjectRepository(Ppp)
    private readonly pppRepository: Repository<Ppp>,

    @InjectRepository(PppProposal)
    private readonly proposalRepository: Repository<PppProposal>,

    @InjectRepository(PppSetting)
    private readonly settingRepository: Repository<PppSetting>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
  ) {}

  async getDriveUrl() {
    let setting = await this.settingRepository.findOne({ where: { id: 1 } });

    if (!setting) {
      setting = this.settingRepository.create({ generalDriveUrl: null });
      await this.settingRepository.save(setting);
    }

    return { generalDriveUrl: setting.generalDriveUrl };
  }

  async updateDriveUrl(dto: UpdatePppSettingDto, user: JwtPayload) {
    await this.validateNotTutor(user);

    let setting = await this.settingRepository.findOne({ where: { id: 1 } });

    if (!setting) {
      setting = this.settingRepository.create({
        generalDriveUrl: dto.generalDriveUrl,
      });
    } else {
      setting.generalDriveUrl = dto.generalDriveUrl;
    }

    await this.settingRepository.save(setting);

    return {
      message: 'Enlace al Drive actualizado correctamente',
      generalDriveUrl: setting.generalDriveUrl,
    };
  }
  private async validateNotTutor(user: JwtPayload) {
    if (user.role === Role.PROFESSOR) {
      const professor = await this.professorRepository.findOne({
        where: { id_user: user.id },
      });

      if (!professor) {
        throw new NotFoundException('Docente no encontrado');
      }

      if (professor.isTutor) {
        throw new ForbiddenException(
          'Los tutores no tienen acceso a la gestión de Prácticas Pre Profesionales',
        );
      }
    }
  }

  private async ensureStudentCanApply(studentIdUser: number) {
    const studentPpps = await this.pppRepository.find({
      where: {
        student: { id_user: studentIdUser },
        isActive: true,
        isSiuLoaded: false,
      },
    });

    const activePpp = studentPpps.find(
      (p) =>
        p.status === PppStatus.PENDING_APPLICATION ||
        p.status === PppStatus.PENDING_DOCUMENTATION ||
        p.status === PppStatus.IN_REVIEW ||
        p.status === PppStatus.OBSERVED ||
        p.status === PppStatus.APPROVED,
    );

    if (activePpp) {
      if (activePpp.status === PppStatus.PENDING_APPLICATION) {
        throw new ConflictException(
          'Ya tenés una postulación pendiente de respuesta. Si es rechazada o cancelada, podrás postularte a otra.',
        );
      }
      throw new ConflictException(
        'Ya contás con un trámite de PPP activo en curso. Debés finalizarlo o abandonarlo antes de iniciar otro.',
      );
    }
  }

  async createProposal(dto: CreatePppProposalDto, user: JwtPayload) {
    await this.validateNotTutor(user);

    const proposal = this.proposalRepository.create(dto);
    return await this.proposalRepository.save(proposal);
  }

  async findAllProposals(user: JwtPayload) {
    if (user.role === Role.PROFESSOR) {
      await this.validateNotTutor(user);
    }

    const whereCondition = user.role === Role.STUDENT ? { isOpen: true } : {};

    const proposals = await this.proposalRepository.find({
      where: whereCondition,
      order: { createdAt: 'DESC' },
    });

    return proposals.map((proposal) => ({
      id: proposal.id,
      title: proposal.title,
      description: proposal.description,
      isOpen: proposal.isOpen,
      driveFolderUrl: proposal.driveFolderUrl,
      createdAt: proposal.createdAt,
    }));
  }

  async findProposalWithApplicants(proposalId: number, user: JwtPayload) {
    await this.validateNotTutor(user);

    const proposal = await this.proposalRepository.findOne({
      where: { id: proposalId },
      relations: [
        'applications',
        'applications.student',
        'applications.student.user',
      ],
    });

    if (!proposal) {
      throw new NotFoundException('Propuesta de PPP no encontrada');
    }

    return {
      id: proposal.id,
      title: proposal.title,
      description: proposal.description,
      isOpen: proposal.isOpen,
      applicants: proposal.applications.map((app) => ({
        applicationId: app.id,
        status: app.status,
        previousKnowledge: app.previousKnowledge,
        createdAt: app.createdAt,
        student: {
          id_user: app.student.id_user,
          fullName: `${app.student.user.firstName} ${app.student.user.lastName}`,
          email: app.student.user.email,
          dni: app.student.user.dni,
          cohort: app.student.yearOfAdmission,
          completedCoursesWithFinal: app.student.completedCoursesWithFinal,
          completedCoursesWithoutFinal:
            app.student.completedCoursesWithoutFinal,
        },
      })),
    };
  }

  async applyToProposal(
    proposalId: number,
    dto: ApplyProposalDto,
    user: JwtPayload,
  ) {
    const student = await this.studentRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (!student) {
      throw new NotFoundException('Perfil de estudiante no encontrado');
    }

    await this.ensureStudentCanApply(student.id_user);

    const proposal = await this.proposalRepository.findOne({
      where: { id: proposalId },
    });
    if (!proposal) throw new NotFoundException('Propuesta no encontrada');
    if (!proposal.isOpen) {
      throw new BadRequestException(
        'Esta convocatoria ya no acepta postulaciones',
      );
    }

    const application = this.pppRepository.create({
      student,
      proposal,
      type: PppType.INTERNAL,
      status: PppStatus.PENDING_APPLICATION,
      previousKnowledge: dto.previousKnowledge,
      isSiuLoaded: false,
      isActive: true,
    });

    const saved = await this.pppRepository.save(application);
    return {
      message:
        'Postulación enviada con éxito. Aguardá la resolución del responsable',
      id: saved.id,
      status: saved.status,
    };
  }

  async createExternal(user: JwtPayload) {
    const student = await this.studentRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (!student) {
      throw new NotFoundException('Perfil de estudiante no encontrado');
    }

    await this.ensureStudentCanApply(student.id_user);

    const ppp = this.pppRepository.create({
      student,
      proposal: null,
      type: PppType.EXTERNAL,
      status: PppStatus.PENDING_DOCUMENTATION,
      isSiuLoaded: false,
      isActive: true,
    });

    const saved = await this.pppRepository.save(ppp);
    return {
      message: 'Trámite de PPP externa iniciado con éxito',
      id: saved.id,
      status: saved.status,
    };
  }

  async acceptApplicant(
    proposalId: number,
    studentId: number,
    user: JwtPayload,
  ) {
    await this.validateNotTutor(user);

    const ppp = await this.pppRepository.findOne({
      where: {
        proposal: { id: proposalId },
        student: { id_user: studentId },
        status: PppStatus.PENDING_APPLICATION,
        isActive: true,
      },
    });
    if (!ppp) throw new NotFoundException('Solicitud no encontrada');

    if (ppp.status !== PppStatus.PENDING_APPLICATION) {
      throw new BadRequestException(
        'Solo se pueden aceptar solicitudes pendientes',
      );
    }

    ppp.status = PppStatus.PENDING_DOCUMENTATION;
    await this.pppRepository.save(ppp);

    return {
      message: 'Estudiante aceptado en la propuesta.',
      id: ppp.id,
      status: ppp.status,
    };
  }

  async rejectApplicant(
    proposalId: number,
    studentId: number,
    user: JwtPayload,
  ) {
    await this.validateNotTutor(user);

    const ppp = await this.pppRepository.findOne({
      where: {
        proposal: { id: proposalId },
        student: { id_user: studentId },
        status: PppStatus.PENDING_APPLICATION,
        isActive: true,
      },
    });
    if (!ppp) throw new NotFoundException('Solicitud no encontrada');

    if (ppp.status !== PppStatus.PENDING_APPLICATION) {
      throw new BadRequestException(
        'Solo se pueden rechazar solicitudes pendientes',
      );
    }

    ppp.status = PppStatus.APPLICATION_REJECTED;
    await this.pppRepository.save(ppp);

    return {
      message:
        'Postulación rechazada. El estudiante queda habilitado para solicitar otra PPP',
      id: ppp.id,
      status: ppp.status,
    };
  }

  async findAllPpp(user: JwtPayload) {
    await this.validateNotTutor(user);

    const ppps = await this.pppRepository.find({
      where: {
        isActive: true,
      },
      relations: ['student', 'student.user', 'proposal'],
    });

    return ppps.map((ppp) => ({
      id: ppp.id,
      type: ppp.type,
      status: ppp.status,
      isSiuLoaded: ppp.isSiuLoaded,
      proposalTitle: ppp.proposal?.title ?? null,
      student: {
        id_user: ppp.student.id_user,
        user: {
          id: ppp.student.user.id,
          firstName: ppp.student.user.firstName,
          lastName: ppp.student.user.lastName,
          dni: ppp.student.user.dni,
          email: ppp.student.user.email,
        },
      },
      createdAt: ppp.createdAt,
    }));
  }

  async findOne(id: number, user: JwtPayload) {
    const ppp = await this.pppRepository.findOne({
      where: { id },
      relations: ['student', 'student.user', 'proposal'],
    });

    if (!ppp) throw new NotFoundException('Trámite de PPP no encontrado');

    if (user.role === Role.STUDENT && ppp.student.id_user !== user.id) {
      throw new ForbiddenException('No tenés permisos para acceder a esta PPP');
    }

    if (user.role === Role.PROFESSOR) {
      await this.validateNotTutor(user);
    }

    const isAcceptedInInternal =
      ppp.type === PppType.INTERNAL &&
      ppp.status !== PppStatus.PENDING_APPLICATION &&
      ppp.status !== PppStatus.APPLICATION_REJECTED;

    return {
      id: ppp.id,
      type: ppp.type,
      status: ppp.status,
      isSiuLoaded: ppp.isSiuLoaded,
      previousKnowledge: ppp.previousKnowledge,
      proposal: ppp.proposal
        ? {
            id: ppp.proposal.id,
            title: ppp.proposal.title,
            description: ppp.proposal.description,
            driveFolderUrl: isAcceptedInInternal
              ? ppp.proposal.driveFolderUrl
              : null,
            internalNotes: isAcceptedInInternal
              ? ppp.proposal.internalNotes
              : null,
          }
        : null,
      student: {
        id_user: ppp.student.id_user,
        user: {
          id: ppp.student.user.id,
          firstName: ppp.student.user.firstName,
          lastName: ppp.student.user.lastName,
          dni: ppp.student.user.dni,
          email: ppp.student.user.email,
        },
      },
      createdAt: ppp.createdAt,
      updatedAt: ppp.updatedAt,
    };
  }

  async notifyDocumentationSent(id: number, user: JwtPayload) {
    const ppp = await this.pppRepository.findOne({
      where: { id },
      relations: ['student'],
    });

    if (!ppp) throw new NotFoundException('Trámite de PPP no encontrado');
    if (ppp.student.id_user !== user.id) {
      throw new ForbiddenException('No tenés permisos sobre esta PPP');
    }

    if (ppp.status === PppStatus.IN_REVIEW) {
      throw new BadRequestException('El trámite ya se encuentra en revisión');
    }
    if (ppp.status === PppStatus.APPROVED) {
      throw new BadRequestException(
        'No podés notificar envíos sobre un trámite aprobado',
      );
    }

    ppp.status = PppStatus.IN_REVIEW;
    await this.pppRepository.save(ppp);

    return {
      message: 'Constancia de envío notificada. El trámite pasa a revisión',
      id: ppp.id,
      status: ppp.status,
    };
  }

  async markAsObserved(id: number, user: JwtPayload) {
    await this.validateNotTutor(user);

    const ppp = await this.pppRepository.findOne({ where: { id } });
    if (!ppp) throw new NotFoundException('Trámite de PPP no encontrado');

    if (ppp.status === PppStatus.APPROVED) {
      throw new BadRequestException(
        'No se pueden hacer observaciones sobre una PPP aprobada',
      );
    }

    ppp.status = PppStatus.OBSERVED;
    await this.pppRepository.save(ppp);

    return {
      message: 'Trámite marcado con observaciones exitosamente',
      id: ppp.id,
      status: ppp.status,
    };
  }

  async markAsApproved(id: number, user: JwtPayload) {
    await this.validateNotTutor(user);

    const ppp = await this.pppRepository.findOne({
      where: { id, isActive: true },
    });

    if (!ppp) {
      throw new NotFoundException('Trámite de PPP no encontrado');
    }

    if (ppp.isSiuLoaded) {
      throw new BadRequestException(
        'La PPP ya fue aprobada y asentada en SIU Guaraní previamente',
      );
    }

    if (
      ppp.status === PppStatus.DROPPED_OUT ||
      ppp.status === PppStatus.APPLICATION_REJECTED
    ) {
      throw new BadRequestException(
        'No se puede calificar una PPP que fue abandonada o rechazada.',
      );
    }

    if (ppp.status === PppStatus.APPROVED) {
      throw new BadRequestException('La PPP ya se encuentra aprobada');
    }

    ppp.status = PppStatus.APPROVED;
    await this.pppRepository.save(ppp);

    return {
      message: 'PPP aprobada exitosamente',
      id: ppp.id,
      status: ppp.status,
    };
  }

  async markAsDisapproved(id: number, user: JwtPayload) {
    await this.validateNotTutor(user);

    const ppp = await this.pppRepository.findOne({
      where: { id, isActive: true },
    });

    if (!ppp) {
      throw new NotFoundException('Trámite de PPP no encontrado');
    }

    if (ppp.isSiuLoaded) {
      throw new BadRequestException(
        'No se puede modificar una PPP que ya fue asentada en SIU Guaraní',
      );
    }

    if (
      ppp.status === PppStatus.DROPPED_OUT ||
      ppp.status === PppStatus.APPLICATION_REJECTED
    ) {
      throw new BadRequestException(
        'No se puede calificar una PPP que fue abandonada o rechazada',
      );
    }

    if (ppp.status === PppStatus.DISAPPROVED) {
      throw new BadRequestException('La PPP ya se encuentra desaprobada');
    }

    ppp.status = PppStatus.DISAPPROVED;
    await this.pppRepository.save(ppp);

    return {
      message: 'PPP registrada como desaprobada',
      id: ppp.id,
      status: ppp.status,
    };
  }

  async abandonPpp(id: number, user: JwtPayload) {
    const ppp = await this.pppRepository.findOne({
      where: { id, isActive: true },
      relations: ['student'],
    });

    if (!ppp) {
      throw new NotFoundException('Trámite de PPP no encontrado');
    }

    if (ppp.student.id_user !== user.id) {
      throw new ForbiddenException(
        'No tienes permiso para modificar este trámite',
      );
    }

    if (ppp.isSiuLoaded) {
      throw new BadRequestException(
        'No se puede modificar una PPP que ya fue asentada en SIU Guaraní',
      );
    }

    if (ppp.status !== PppStatus.PENDING_DOCUMENTATION) {
      throw new BadRequestException(
        'Solo se puede abandonar la PPP mientras se encuentre pendiente de entrega de documentación. Si ya entró en evaluación o tiene nota, debe resolverse académicamente',
      );
    }

    ppp.status = PppStatus.DROPPED_OUT;
    await this.pppRepository.save(ppp);

    return {
      message: 'Has abandonado el trámite de PPP exitosamente',
      id: ppp.id,
      status: ppp.status,
    };
  }

  async loadToSiu(id: number, user: JwtPayload) {
    await this.validateNotTutor(user);

    const ppp = await this.pppRepository.findOne({
      where: { id, isActive: true },
    });

    if (!ppp)
      throw new NotFoundException('Trámite de PPP no encontrado o inactivo');
    if (ppp.status !== PppStatus.APPROVED) {
      throw new BadRequestException(
        'Solo se pueden asentar en el SIU los trámites aprobados',
      );
    }
    if (ppp.isSiuLoaded) {
      throw new BadRequestException(
        'Este trámite ya fue asentado previamente en el SIU',
      );
    }

    ppp.isSiuLoaded = true;
    await this.pppRepository.save(ppp);

    return {
      message:
        'Nota asentada en el SIU con éxito. Trámite archivado del período activo',
      id: ppp.id,
      isSiuLoaded: ppp.isSiuLoaded,
    };
  }

  async remove(id: number) {
    const ppp = await this.pppRepository.findOne({
      where: { id, isActive: true },
    });

    if (!ppp) {
      throw new NotFoundException(
        'Trámite de PPP no encontrado o ya dado de baja',
      );
    }

    if (ppp.isSiuLoaded) {
      throw new BadRequestException(
        'No se puede dar de baja una PPP que ya fue asentada en SIU Guaraní',
      );
    }

    ppp.isActive = false;
    await this.pppRepository.save(ppp);

    return {
      message: 'Trámite dado de baja exitosamente.',
      id: ppp.id,
      isActive: ppp.isActive,
    };
  }

  async changeProposalStatus(
    id: number,
    dto: UpdateProposalStatusDto,
    user: JwtPayload,
  ) {
    await this.validateNotTutor(user);

    const proposal = await this.proposalRepository.findOne({
      where: { id },
    });

    if (!proposal) {
      throw new NotFoundException('Propuesta no encontrada');
    }

    if (proposal.isOpen === dto.isOpen) {
      throw new BadRequestException(
        `La propuesta ya se encuentra ${dto.isOpen ? 'abierta' : 'cerrada'}`,
      );
    }

    proposal.isOpen = dto.isOpen;
    await this.proposalRepository.save(proposal);

    return {
      message: dto.isOpen
        ? 'Convocatoria reabierta exitosamente'
        : 'Convocatoria cerrada exitosamente. No se aceptan nuevas postulaciones',
      id: proposal.id,
      isOpen: proposal.isOpen,
    };
  }
}
