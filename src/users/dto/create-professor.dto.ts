import { IsBoolean, IsString } from 'class-validator';

export class CreateProfessorDto {
  @IsString()
  specialization: string;

  @IsBoolean()
  isTutor: boolean;
}
