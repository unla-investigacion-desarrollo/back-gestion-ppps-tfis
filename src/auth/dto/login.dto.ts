import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'El email es un campo obligatorio' })
  @IsEmail({}, { message: 'El formato de email no es valido' })
  email: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsNotEmpty({ message: 'La contraseña es un campo obligatorio' })
  @IsString()
  password: string;
}
