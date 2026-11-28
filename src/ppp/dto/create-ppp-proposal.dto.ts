import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreatePppProposalDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @MaxLength(2000, {
    message: 'La descripción no puede superar los 2000 caracteres',
  })
  description: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' && value.trim() === '' ? null : value,
  )
  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'El enlace del Drive debe ser una URL válida' })
  driveFolderUrl?: string;

  @IsString()
  @IsOptional()
  internalNotes?: string;
}
