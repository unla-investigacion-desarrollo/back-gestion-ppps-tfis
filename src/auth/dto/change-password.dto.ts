import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @Transform(({ value }: { value: string }) => value.trim())
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  currentPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @Transform(({ value }: { value: string }) => value.trim())
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  newPassword: string;
}
