import { ConflictException, Injectable } from '@nestjs/common';
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

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;

    const hashed = await bcrypt.hash(password, 12);

    const user = this.usersRepository.create({
      ...rest,
      password: hashed,
    });

    return await this.usersRepository.save(user);
  }

  async createStudent(createStudentDto: CreateStudentDto, user: User) {
    const student = this.studentsRepository.create({
      user,
      yearOfAdmission: createStudentDto.yearOfAdmission,
      completedCoursesWithFinal: createStudentDto.completedCoursesWithFinal,
      completedCoursesWithoutFinal:
        createStudentDto.completedCoursesWithoutFinal,
    });

    return await this.studentsRepository.save(student);
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

  /* update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  } */

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
}
