import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JoinRoomDto {
  @ApiProperty({
    example: 'ABC123',
    description: 'Code of the room to join',
  })
  @IsString()
  code: string;
}
