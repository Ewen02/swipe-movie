import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { PrismaService } from '../../infra/prisma.service';
import { ThrottleStrict } from '../../common/decorators/throttle.decorator';

import { OauthUpsertDto, LoginOauthDto } from './dtos';

@ApiTags('Auth')
@Controller('auth')
@ThrottleStrict() // Apply strict rate limiting to all auth endpoints
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly auth: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @ApiOperation({ summary: 'Upsert user from OAuth provider' })
  @ApiOkResponse({ description: 'User upserted successfully' })
  @Post('oauth-upsert')
  async oauthUpsert(@Body() dto: OauthUpsertDto) {
    this.logger.log(`OAuth upsert request for email: ${dto.email}`);

    if (!dto.email || !dto.name) {
      throw new BadRequestException('Email and name are required');
    }

    try {
      await this.prisma.user.upsert({
        where: { email: dto.email },
        update: { name: dto.name },
        create: { email: dto.email, name: dto.name },
      });
      this.logger.log(`User upserted successfully: ${dto.email}`);
      return { ok: true };
    } catch (error) {
      this.logger.error(`Failed to upsert user: ${dto.email}`, error);
      throw new BadRequestException('Failed to create or update user');
    }
  }

  @ApiOperation({ summary: 'Login with OAuth and get JWT token' })
  @ApiOkResponse({ description: 'JWT access token' })
  @Post('login-oauth')
  async loginOauth(@Body() dto: LoginOauthDto) {
    this.logger.log(`OAuth login request for email: ${dto.email}`);

    if (!dto.email) {
      throw new BadRequestException('Email is required');
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) {
        this.logger.warn(`User not found for email: ${dto.email}`);
        throw new UnauthorizedException('User not found');
      }

      const accessToken = this.auth.issueToken(user);
      this.logger.log(`Token issued successfully for user: ${user.id}`);

      return { accessToken };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`Failed to login user: ${dto.email}`, error);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
