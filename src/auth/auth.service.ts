import {
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

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

  private async buildTokenResponse(user: any, email: string) {
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
