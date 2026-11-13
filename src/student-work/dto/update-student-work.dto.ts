import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentWorkDto } from './create-student-work.dto';

export class UpdateStudentWorkDto extends PartialType(CreateStudentWorkDto) {}
