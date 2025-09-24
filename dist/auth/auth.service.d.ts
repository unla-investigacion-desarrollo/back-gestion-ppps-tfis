import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterStudentDto } from './dto/register-student.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    registerStudent(registerDto: RegisterStudentDto): Promise<{
        message: string;
        studentId: number;
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        email: string;
    }>;
}
