import {
  IsOptional,
  IsString,
  IsBoolean,
  IsEmail,
  IsNumber,
  IsNotEmpty,
  MinLength,
  Length,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  lastName?: string;

  @IsOptional()
  @IsString()
  @Length(7, 8, { message: 'El DNI debe tener entre 7 y 8 digitos' })
  @Matches(/^[0-9]+$/, { message: 'El DNI solo puede contener números' })
  dni?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El formato de email no es valido' })
  email?: string;

  @IsOptional()
  @IsNumber()
  yearOfAdmission?: number;

  @IsOptional()
  @IsNumber()
  completedCoursesWithFinal?: number;

  @IsOptional()
  @IsNumber()
  completedCoursesWithoutFinal?: number;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsBoolean()
  isTutor?: boolean;
}
