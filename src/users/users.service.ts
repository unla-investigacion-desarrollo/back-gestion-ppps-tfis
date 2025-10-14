import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Role, User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Student } from './entities/student.entity';
import { Professor } from './entities/professor.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import * as bcrypt from 'bcrypt';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { RegisterProfessorDto } from './dto/register-professor.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,

    @InjectRepository(Professor)
    private professorsRepository: Repository<Professor>,

    private dataSource: DataSource,
  ) {}

  async createUserAdmin(createUserDto: CreateUserDto) {
    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);

      const { password, ...rest } = createUserDto;

      const hashed = await bcrypt.hash(password, 12);
      const userAdmin = userRepo.create({
        ...rest,
        password: hashed,
        role: Role.ADMIN,
      });
      await userRepo.save(userAdmin);

      return userAdmin;
    });
  }

  async createUserAndStudent(
    createUserDto: CreateUserDto,
    createStudentDto: CreateStudentDto,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const studentRepo = manager.getRepository(Student);

      const { password, ...rest } = createUserDto;

      const hashed = await bcrypt.hash(password, 12);
      const user = userRepo.create({ ...rest, password: hashed });
      await userRepo.save(user);

      const student = studentRepo.create({ user, ...createStudentDto });
      await studentRepo.save(student);

      return student;
    });
  }

  // Referencia: https://bluuweb.dev/nestjs/auth-jwt.html
  async findOneByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  async findOneByDNI(dni: string) {
    return await this.usersRepository.findOneBy({ dni });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async createProfessor(
    createUserDto: CreateUserDto,
    createProfessorDto: CreateProfessorDto,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const professorRepo = manager.getRepository(Professor);

      const { password, ...rest } = createUserDto;
      const hashed = await bcrypt.hash(password, 12);

      const user = userRepo.create({
        ...rest,
        password: hashed,
        role: Role.PROFESSOR,
      });
      await userRepo.save(user);

      const professor = professorRepo.create({
        user,
        specialization: createProfessorDto.specialization,
        isTutor: createProfessorDto.isTutor,
      });
      await professorRepo.save(professor);

      return professor;
    });
  }

  async registerProfessor(registerProfessorDto: RegisterProfessorDto) {
    const userExistsByDNI = await this.findOneByDNI(registerProfessorDto.dni);
    if (userExistsByDNI) {
      throw new ConflictException('Ya existe un usuario con ese DNI');
    }

    const userExistsByEmail = await this.findOneByEmail(
      registerProfessorDto.email,
    );
    if (userExistsByEmail) {
      throw new ConflictException('Ya existe un usuario con ese email');
    }

    const createUserDto: CreateUserDto = {
      firstName: registerProfessorDto.firstName,
      lastName: registerProfessorDto.lastName,
      dni: registerProfessorDto.dni,
      email: registerProfessorDto.email,
      password: registerProfessorDto.password,
    };

    const createProfessorDto: CreateProfessorDto = {
      specialization: registerProfessorDto.specialization,
      isTutor: registerProfessorDto.isTutor,
    };

    const professor = await this.createProfessor(
      createUserDto,
      createProfessorDto,
    );

    return {
      message: 'Profesor creado exitosamente',
      professorId: professor.id_user,
    };
  }

  async registerAdmin(createUserDto: CreateUserDto) {
    const userExistsByDNI = await this.findOneByDNI(createUserDto.dni);
    if (userExistsByDNI) {
      throw new ConflictException('Ya existe un usuario con ese DNI');
    }

    const userExistsByEmail = await this.findOneByEmail(createUserDto.email);
    if (userExistsByEmail) {
      throw new ConflictException('Ya existe un usuario con ese email');
    }

    const admin = await this.createUserAdmin(createUserDto);

    return {
      message: 'Admin creado exitosamente',
      adminId: admin.id,
      adminEmail: admin.email,
    };
  }

  async updateProfile(
    userId: number,
    updateUserDto: UpdateUserDto,
    requesterId: number,
  ) {
    const requester = await this.usersRepository.findOne({
      where: { id: requesterId },
    });
    if (!requester) throw new NotFoundException('Solicitante no encontrado');

    const targetUser = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!targetUser) throw new NotFoundException('Usuario no encontrado');

    if (requester.id !== targetUser.id && requester.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'No tienes permiso para actualizar este perfil',
      );
    }

    Object.assign(targetUser, {
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      dni: updateUserDto.dni,
      email: updateUserDto.email,
    });
    await this.usersRepository.save(targetUser);

    if (targetUser.role === Role.STUDENT) {
      const student = await this.studentsRepository.findOne({
        where: { id_user: targetUser.id },
      });
      if (student) {
        Object.assign(student, {
          yearOfAdmission: updateUserDto.yearOfAdmission,
          completedCoursesWithFinal: updateUserDto.completedCoursesWithFinal,
          completedCoursesWithoutFinal:
            updateUserDto.completedCoursesWithoutFinal,
        });
        await this.studentsRepository.save(student);
      }
    }

    if (targetUser.role === Role.PROFESSOR) {
      const professor = await this.professorsRepository.findOne({
        where: { id_user: targetUser.id },
      });
      if (professor) {
        Object.assign(professor, {
          specialization: updateUserDto.specialization,
          isTutor: updateUserDto.isTutor,
        });
        await this.professorsRepository.save(professor);
      }
    }

    return { message: 'Perfil actualizado correctamente' };
  }
}
