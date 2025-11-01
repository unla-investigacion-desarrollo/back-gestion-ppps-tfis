import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ProjectStatus } from '../entities/project.entity';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'La descripción no puede ser un campo vacio' })
  description: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus = ProjectStatus.PENDING;
}
