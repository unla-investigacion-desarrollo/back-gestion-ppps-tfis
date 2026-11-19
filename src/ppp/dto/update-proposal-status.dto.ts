import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateProposalStatusDto {
  @IsBoolean()
  @IsNotEmpty()
  isOpen: boolean;
}
