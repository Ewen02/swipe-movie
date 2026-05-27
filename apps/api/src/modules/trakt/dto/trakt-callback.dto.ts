import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class TraktCallbackDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  code!: string;
}
