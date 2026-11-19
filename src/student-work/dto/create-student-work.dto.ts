import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateStudentWorkDto {
  @IsNotEmpty({ message: 'La URL del documento es obligatoria' })
  @IsUrl(
    { host_whitelist: ['docs.google.com'] },
    { message: 'Debe ser un enlace válido de Google Docs' },
  )
  documentUrl: string;

  @IsOptional()
  @IsUrl(
    { host_whitelist: ['drive.google.com'] },
    { message: 'Debe ser un enlace válido de Google Drive' },
  )
  driveFolderUrl?: string;
}
