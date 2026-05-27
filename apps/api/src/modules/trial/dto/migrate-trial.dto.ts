import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class MigrateTrialDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  guestId!: string;
}
