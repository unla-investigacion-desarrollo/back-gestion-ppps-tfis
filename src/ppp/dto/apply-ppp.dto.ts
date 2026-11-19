import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ApplyProposalDto {
  @IsString()
  @IsNotEmpty({
    message: 'Contanos tus conocimientos previos y áreas de interés',
  })
  @MaxLength(1500, {
    message: 'La descripción no puede superar los 1500 caracteres',
  })
  previousKnowledge: string;
}
