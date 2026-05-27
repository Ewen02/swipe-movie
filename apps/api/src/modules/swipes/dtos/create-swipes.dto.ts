import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, MaxLength } from 'class-validator';

export class CreateSwipeDto {
  @ApiProperty({
    example: true,
    description: 'Like or dislike movie',
  })
  @IsBoolean()
  value!: boolean;

  @ApiProperty({
    example: 'tt1234567',
    description: 'ID of the movie title',
  })
  @IsString()
  @MaxLength(50)
  movieId!: string;

  @ApiProperty({
    example: 'room-123',
    description: 'ID of the room',
  })
  @IsString()
  @MaxLength(50)
  roomId!: string;
}
