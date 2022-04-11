import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePersonDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, {
    message: 'Use at least 8 characters',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2, {
    message: 'Use a valid alpha 2 language code',
  })
  @MaxLength(2, {
    message: 'Use a valid alpha 2 language code',
  })
  defaultLanguage: string;
}
