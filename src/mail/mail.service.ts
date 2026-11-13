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
}
