import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OauthUpsertDto {
  @ApiProperty({ example: 'richard@email.com', description: 'User email' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Richard', description: 'User name' })
  @IsString()
  name: string;
}
