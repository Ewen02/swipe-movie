import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsNumber, MaxLength } from 'class-validator';

export class MatchBaseDto {
  @ApiProperty({ example: 'matche-123' })
  @IsString()
  @MaxLength(50)
  id!: string;

  @ApiProperty({ example: 'movie-1234567' })
  @IsString()
  @MaxLength(50)
  movieId!: string;

  @ApiProperty({ example: 'room-123' })
  @IsString()
  @MaxLength(50)
  roomId!: string;

  @ApiProperty({
    example: 3,
    description: 'Number of likes (votes) for this match',
  })
  @IsNumber()
  voteCount!: number;

  @ApiProperty({ example: '2025-09-04T10:15:30Z' })
  @IsDate()
  createdAt!: Date;
}
