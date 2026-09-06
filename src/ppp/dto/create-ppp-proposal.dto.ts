import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

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

  @IsString()
  @IsOptional()
  driveFolderUrl?: string;

  @IsString()
  @IsOptional()
  internalNotes?: string;
}
