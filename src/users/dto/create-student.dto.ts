import { IsInt, Max, Min } from 'class-validator';

export class CreateStudentDto {
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
