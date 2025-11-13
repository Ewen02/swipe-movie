import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMatchDto {
  @ApiProperty({ example: 'movie-1234567' })
  @IsString()
  movieId!: string;

  @ApiProperty({ example: 'room-123' })
  @IsString()
  roomId!: string;
}
