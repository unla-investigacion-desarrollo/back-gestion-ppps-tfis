import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdatePppProposalDto {
  @IsOptional()
  @IsString({ message: 'El título debe ser un texto válido' })
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000, {
    message: 'La descripción no puede superar los 2000 caracteres',
  })
  description?: string;

  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'El enlace del Drive debe ser una URL válida' })
  driveFolderUrl?: string;

  @IsOptional()
  @IsString()
  internalNotes?: string;
}
