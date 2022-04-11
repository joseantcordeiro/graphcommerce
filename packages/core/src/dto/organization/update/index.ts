import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrganizationDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}