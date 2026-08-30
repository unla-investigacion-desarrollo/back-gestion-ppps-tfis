import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  projectTypeId: number;

  @IsOptional()
  @IsString()
  customProjectType?: string;
}
