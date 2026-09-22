import { PartialType } from '@nestjs/mapped-types';
import { CreatePppDto } from './create-ppp.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { PppType } from '../entities/ppp.entity';

export class UpdatePppDto extends PartialType(CreatePppDto) {
  @IsEnum(PppType)
  @IsOptional()
  type?: PppType;
}
