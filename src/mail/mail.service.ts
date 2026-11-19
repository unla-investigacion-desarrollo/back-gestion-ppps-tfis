import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendWelcomeEmail(to: string, name: string) {
    const loginUrl = `${this.configService.get<string>('FRONTEND_URL')}/login`;

    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Bienvenido al Sistema de Gestión de PPP y TFI',
        template: './welcome',
        context: {
          name,
          loginUrl,
        },
      });
      this.logger.log(`Correo de bienvenida enviado exitosamente a: ${to}`);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error enviando correo a ${to}:`, err.message);
      throw new InternalServerErrorException(
        'Error al enviar el correo de bienvenida',
      );
    }
  }

  async sendPasswordResetEmail(to: string, name: string, token: string) {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${token}`;

    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Recuperación de Contraseña - Gestión PPP y TFI',
        template: './reset-password',
        context: {
          name,
          resetUrl,
        },
      });
      this.logger.log(`Correo de reseteo enviado exitosamente a: ${to}`);
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Error enviando correo de reseteo a ${to}:`,
        err.message,
      );
      throw new InternalServerErrorException(
        'Error al enviar el correo de recuperación',
      );
    }
  }

  async sendStatusUpdateEmail(
    to: string,
    name: string,
    processName: string,
    newStatus: string,
    actionMessage: string,
  ) {
    const loginUrl = `${this.configService.get<string>('FRONTEND_URL')}/login`;

    try {
      await this.mailerService.sendMail({
        to,
        subject: `Actualización de tu trámite: ${newStatus}`,
        template: './status-update',
        context: {
          name,
          processName,
          newStatus,
          actionMessage,
          loginUrl,
        },
      });
      this.logger.log(`Correo de actualización de estado enviado a: ${to}`);
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Error enviando correo de estado a ${to}:`,
        err.message,
      );
    }
  }

  async sendStaffAlertEmail(
    to: string,
    name: string,
    processName: string,
    actionRequired: string,
    referenceLabel: string,
    referenceValue: string,
  ) {
    const loginUrl = `${this.configService.get<string>('FRONTEND_URL')}/login`;

    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Aviso del Sistema: Acción requerida',
        template: './action-required',
        context: {
          name,
          processName,
          actionRequired,
          referenceLabel,
          referenceValue,
          loginUrl,
        },
      });
      this.logger.log(`Alerta de sistema enviada a staff: ${to}`);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error enviando alerta a staff ${to}:`, err.message);
    }
  }

  async sendPppAlertEmail(
    to: string,
    cc: string,
    studentName: string,
    proposalTitle: string,
    file: Express.Multer.File,
  ) {
    const loginUrl = `${this.configService.get<string>('FRONTEND_URL')}/login`;

    const attachments = file
      ? [
          {
            filename: file.originalname,
            content: file.buffer,
          },
        ]
      : [];

    try {
      await this.mailerService.sendMail({
        to,
        cc,
        subject: 'Aviso de PPP: Nueva documentación recibida',
        template: './action-required',
        attachments,
        context: {
          name: 'Equipo de Evaluación PPP',
          processName: 'Práctica Pre-Profesional (PPP)',
          actionRequired:
            'Se ha enviado nueva documentación para su revisión (ver PDF adjunto).',
          referenceLabel: 'Postulante y Proyecto',
          referenceValue: `${studentName} - ${proposalTitle}`,
          loginUrl,
        },
      });
      this.logger.log(`Alerta de PPP con adjunto enviada a ${to} (CC: ${cc})`);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error enviando alerta de PPP a ${to}:`, err.message);
    }
  }
}
