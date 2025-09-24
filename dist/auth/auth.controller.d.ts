import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterStudentDto } from './dto/register-student.dto';
import { JwtPayload } from './types/jwt-payload.interface';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    registerStudent(registerDto: RegisterStudentDto): Promise<{
        message: string;
        studentId: number;
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        email: string;
    }>;
    getProfile(req: Request & {
        user: JwtPayload;
    }): JwtPayload;
}
