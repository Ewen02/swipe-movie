import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginOauthDto {
  @ApiProperty({ example: 'richard@email.com', description: 'User email' })
  @IsEmail()
  email!: string;
}
