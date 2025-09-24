import { CreateUserDto } from './create-user.dto';
export declare class CreateProfessorDto extends CreateUserDto {
    specialization: string;
    isTutor: boolean;
}
