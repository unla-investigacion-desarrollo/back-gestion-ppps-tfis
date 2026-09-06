import { IsNotEmpty, IsUrl } from 'class-validator';

export class UpdatePppSettingDto {
  @IsUrl({}, { message: 'Debe ingresar un enlace URL válido' })
  @IsNotEmpty({ message: 'El enlace al Drive no puede estar vacío' })
  generalDriveUrl: string;
}
