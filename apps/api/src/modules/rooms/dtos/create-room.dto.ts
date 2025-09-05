import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({
    example: 'My Room',
    description: 'Name of the room',
  })
  @IsString()
  name: string;
}
