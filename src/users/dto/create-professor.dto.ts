import { IsBoolean, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class CreateProfessorDto extends CreateUserDto {
  @IsString()
  specialization: string;

  @IsBoolean()
  isTutor: boolean;
}
