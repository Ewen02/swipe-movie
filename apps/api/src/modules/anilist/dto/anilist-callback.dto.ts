import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class AniListCallbackDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  code!: string;
}
