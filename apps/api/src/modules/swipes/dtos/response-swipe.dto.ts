import { ApiProperty } from '@nestjs/swagger';
import { SwipeBaseDto } from './swipe.dto';
import { IsBoolean } from 'class-validator';

export class ResponseSwipeDto extends SwipeBaseDto {}

export class ResponseCreateSwipeDto extends ResponseSwipeDto {
  @ApiProperty({
    example: true,
    description: 'Indicates if a match was created',
  })
  @IsBoolean()
  matchCreated!: boolean;
}
