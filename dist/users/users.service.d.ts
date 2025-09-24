import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository, DataSource } from 'typeorm';
import { Student } from './entities/student.entity';
import { Professor } from './entities/professor.entity';
import { CreateStudentDto } from './dto/create-student.dto';
export declare class UsersService {
    private usersRepository;
    private studentsRepository;
    private professorsRepository;
    private dataSource;
    constructor(usersRepository: Repository<User>, studentsRepository: Repository<Student>, professorsRepository: Repository<Professor>, dataSource: DataSource);
    create(createUserDto: CreateUserDto): Promise<User>;
    createStudent(createStudentDto: CreateStudentDto, user: User): Promise<Student>;
    createUserAndStudent(createUserDto: CreateUserDto, createStudentDto: CreateStudentDto): Promise<Student>;
    findOneByEmail(email: string): Promise<User | null>;
    findOneByDNI(dni: string): Promise<User | null>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateUserDto: UpdateUserDto): string;
    remove(id: number): string;
}
