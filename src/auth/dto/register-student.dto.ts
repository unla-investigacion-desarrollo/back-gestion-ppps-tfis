import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class RegisterStudentDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es un campo obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es un campo obligatorio' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  lastName: string;

  @IsString()
  @IsNotEmpty({ message: 'El DNI es un campo obligatorio' })
  @Length(7, 8, { message: 'El DNI debe tener entre 7 y 8 digitos' })
  @Matches(/^[0-9]+$/, { message: 'El DNI solo puede contener números' })
  dni: string;

  @IsNotEmpty({ message: 'El email es un campo obligatorio' })
  @IsEmail({}, { message: 'El formato de email no es valido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' && value.trim() === '' ? null : value,
  )
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
}
