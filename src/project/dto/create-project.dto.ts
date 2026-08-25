import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ProjectType } from '../entities/project.entity';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ProjectType)
  @IsNotEmpty({ message: 'El tipo de proyecto es obligatorio' })
  projectType: ProjectType;

  @ValidateIf((o: CreateProjectDto) => o.projectType === ProjectType.OTHER)
  @IsNotEmpty({
    message:
      'Debe especificar el tipo de proyecto personalizado si selecciona "otro"',
  })
  @IsString()
  customProjectType?: string;
}
