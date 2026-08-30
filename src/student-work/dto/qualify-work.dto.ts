import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class QualifyWorkDto {
  @IsInt({ message: 'La calificación debe ser un número entero' })
  @Min(0, { message: 'La calificación mínima es 0 (Ausente)' })
  @Max(10, { message: 'La calificación máxima es 10' })
  @IsNotEmpty({ message: 'La calificación es obligatoria' })
  qualification: number;
}
