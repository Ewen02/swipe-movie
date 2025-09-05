import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate } from 'class-validator';

export class MatchBaseDto {
  @ApiProperty({ example: 'matche-123' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'movie-1234567' })
  @IsString()
  movieId: string;

  @ApiProperty({ example: 'room-123' })
  @IsString()
  roomId: string;

  @ApiProperty({ example: '2025-09-04T10:15:30Z' })
  @IsDate()
  createdAt: Date;
}
