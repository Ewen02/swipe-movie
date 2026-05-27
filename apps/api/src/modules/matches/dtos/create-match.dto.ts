import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateMatchDto {
  @ApiProperty({ example: 'movie-1234567' })
  @IsString()
  @MaxLength(50)
  movieId!: string;

  @ApiProperty({ example: 'room-123' })
  @IsString()
  @MaxLength(50)
  roomId!: string;
}
