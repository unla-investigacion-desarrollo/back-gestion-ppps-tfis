import { IsEnum, IsNotEmpty } from 'class-validator';
import { PppType } from '../entities/ppp.entity';

export class CreatePppDto {
  @IsEnum(PppType)
  @IsNotEmpty()
  type: PppType;
}
