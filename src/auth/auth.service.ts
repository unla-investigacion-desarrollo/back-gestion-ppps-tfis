import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateStudentDto } from 'src/users/dto/create-student.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterStudentDto } from './dto/register-student.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/users/entities/user.entity';
import { ResetPasswordPayload } from './types/reset-password-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async registerStudent(registerDto: RegisterStudentDto) {
    const userExistsByDNI = await this.usersService.findOneByDNI(
      registerDto.dni,
    );
    if (userExistsByDNI) {
      throw new ConflictException('Ya existe un usuario con ese DNI');
    }

    const userExistsByEmail = await this.usersService.findOneByEmail(
      registerDto.email,
    );
    if (userExistsByEmail) {
      throw new ConflictException('Ya existe un usuario con ese email');
    }

    const createUserDto: CreateUserDto = {
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      dni: registerDto.dni,
      email: registerDto.email,
      password: registerDto.password,
      fileNumber: registerDto.fileNumber,
    };

    const createStudentDto: CreateStudentDto = {
      yearOfAdmission: registerDto.yearOfAdmission,
      completedCoursesWithFinal: registerDto.completedCoursesWithFinal,
      completedCoursesWithoutFinal: registerDto.completedCoursesWithoutFinal,
    };

    const student = await this.usersService.createUserAndStudent(
      createUserDto,
      createStudentDto,
    );

    await this.mailService.sendWelcomeEmail(
      registerDto.email,
      registerDto.firstName,
    );

    return {
      message: 'Estudiante creado exitosamente',
      studentId: student.id_user,
    };
  }

  async login(loginDto: LoginDto) {
    const userExists = await this.usersService.findOneByEmail(loginDto.email);

    if (!userExists) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    if (!userExists.isActive) {
      throw new UnauthorizedException(
        'El usuario se encuentra inactivo. Comuníquese con administración.',
      );
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      userExists.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    return this.buildTokenResponse(userExists, loginDto.email);
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      return {
        message:
          'Si el correo está registrado, se envió un enlace de recuperación',
      };
    }

    const resetToken = await this.jwtService.signAsync(
      { id: user.id, email: user.email, action: 'reset-password' },
      { expiresIn: '15m' },
    );

    await this.mailService.sendPasswordResetEmail(
      user.email,
      `${user.firstName} ${user.lastName}`,
      resetToken,
    );

    return {
      message:
        'Si el correo está registrado, se envió un enlace de recuperación',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload =
        await this.jwtService.verifyAsync<ResetPasswordPayload>(token);

      if (payload.action !== 'reset-password') {
        throw new BadRequestException('Token no válido para esta operación');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await this.usersService.updatePassword(payload.id, hashedPassword);

      return { message: 'Contraseña restablecida con éxito' };
    } catch {
      throw new BadRequestException(
        'El enlace de recuperación es inválido o ha expirado',
      );
    }
  }

  private async buildTokenResponse(user: User, email: string) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      email,
    };
  }
}
