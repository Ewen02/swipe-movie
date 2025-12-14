import { IsString, IsNotEmpty } from 'class-validator';

export class TraktCallbackDto {
  @IsString()
  @IsNotEmpty()
  code!: string;
}
