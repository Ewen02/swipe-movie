import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class JoinRoomDto {
  @ApiProperty({
    example: 'ABC123',
    description: 'Code of the room to join',
  })
  @IsString()
  @MaxLength(10)
  code!: string;
}
