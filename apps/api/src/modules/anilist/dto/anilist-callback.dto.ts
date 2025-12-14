import { IsString, IsNotEmpty } from 'class-validator';

export class AniListCallbackDto {
  @IsString()
  @IsNotEmpty()
  code!: string;
}
