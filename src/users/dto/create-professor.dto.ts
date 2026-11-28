import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateProfessorDto {
  @IsOptional()
  @IsString()
  specialization: string;

  @IsBoolean()
  isTutor: boolean;
}
