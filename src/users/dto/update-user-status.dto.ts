import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateUserStatusDto {
  @IsNotEmpty({ message: 'El campo isActive es obligatorio' })
  @IsBoolean({
    message: 'El campo isActive debe ser un booleano (true o false)',
  })
  isActive: boolean;
}
