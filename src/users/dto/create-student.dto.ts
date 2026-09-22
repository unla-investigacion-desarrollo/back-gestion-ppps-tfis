import { IsNumber } from 'class-validator';

export class CreateStudentDto {
  @IsNumber()
  yearOfAdmission: number;

  @IsNumber()
  completedCoursesWithFinal: number;

  @IsNumber()
  completedCoursesWithoutFinal: number;
}
