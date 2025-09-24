import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Matches,
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

  @IsNumber()
  yearOfAdmission: number;

  @IsNumber()
  completedCoursesWithFinal: number;

  @IsNumber()
  completedCoursesWithoutFinal: number;
}
