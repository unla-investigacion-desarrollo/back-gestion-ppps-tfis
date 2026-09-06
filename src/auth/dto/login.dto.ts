import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'El email es un campo obligatorio' })
  @IsEmail({}, { message: 'El formato de email no es valido' })
  email: string;

  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}
