import {
  IsOptional,
  IsString,
  IsBoolean,
  IsEmail,
  MinLength,
  Length,
  Matches,
  Max,
  Min,
  IsInt,
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
  @IsString()
  fileNumber?: string;

  @IsInt()
  @Min(2008, { message: 'El año de ingreso no puede ser anterior a 2008.' })
  @Max(new Date().getFullYear(), {
    message: 'El año de ingreso no puede ser mayor al año actual.',
  })
  yearOfAdmission: number;

  @IsInt()
  @Min(15, {
    message:
      'Debés tener al menos 15 materias aprobadas para habilitar el trámite de PPP.',
  })
  @Max(45, {
    message: 'La cantidad de materias supera el máximo de 45.',
  })
  completedCoursesWithFinal: number;

  @IsInt()
  @Min(0, {
    message: 'Las materias sin final no pueden ser un número negativo.',
  })
  @Max(45, {
    message: 'La cantidad de materias supera el máximo de 45.',
  })
  completedCoursesWithoutFinal: number;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsBoolean()
  isTutor?: boolean;
}
