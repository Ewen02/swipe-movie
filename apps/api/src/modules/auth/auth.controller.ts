import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../../infra/prisma.service';

import { OauthUpsertDto, LoginOauthDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('oauth-upsert')
  async oauthUpsert(@Body() dto: OauthUpsertDto) {
    await this.prisma.user.upsert({
      where: { email: dto.email },
      update: { name: dto.name },
      create: { email: dto.email, name: dto.name },
    });
    return { ok: true };
  }

  @Post('login-oauth')
  async loginOauth(@Body() dto: LoginOauthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return { accessToken: this.auth.issueToken(user) };
  }
}
