import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Student } from './entities/student.entity';
import { Professor } from './entities/professor.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import * as bcrypt from 'bcrypt';

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
}
