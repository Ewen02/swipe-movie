import {
  Body,
  Controller,
  Post,
  UseGuards,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { PrismaService } from '../../infra/prisma.service';
import { ThrottleStrict } from '../../common/decorators/throttle.decorator';
import { NestEmailService } from '../email/email.service';
import { InternalApiGuard } from '../../common/guards/internal-api.guard';

import { OauthUpsertDto, LoginOauthDto } from './dtos';

@ApiTags('Auth')
@Controller('auth')
@ThrottleStrict() // Apply strict rate limiting to all auth endpoints
@UseGuards(InternalApiGuard) // All auth endpoints require internal API secret
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly auth: AuthService,
    private readonly prisma: PrismaService,
    private readonly emailService: NestEmailService,
  ) {}

  @ApiOperation({ summary: 'Upsert user from OAuth provider' })
  @ApiOkResponse({ description: 'User upserted successfully' })
  @Post('oauth-upsert')
  async oauthUpsert(@Body() dto: OauthUpsertDto) {
    // This endpoint is only callable with InternalApiGuard (X-Internal-Secret)
    // from the web app's Better Auth databaseHooks. The caller is responsible
    // for only invoking it after a verified OAuth callback — there is no
    // emailVerified check here because the provider already validated it
    // upstream. If a new provider that doesn't verify email is added, gate
    // it on the web side or pass an `emailVerified` flag.
    this.logger.log(`OAuth upsert request for email: ${dto.email}`);

    if (!dto.email || !dto.name) {
      throw new BadRequestException('Email and name are required');
    }

    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      const isNewUser = !existingUser;

      await this.prisma.user.upsert({
        where: { email: dto.email },
        update: { name: dto.name },
        // Only set locale on creation so we don't overwrite a returning
        // user's stored preference with whatever locale this request used.
        create: {
          email: dto.email,
          name: dto.name,
          ...(dto.locale ? { locale: dto.locale } : {}),
        },
      });
      this.logger.log(`User upserted successfully: ${dto.email}`);

      // signup_completed stays client-side: the browser knows trial-vs-direct
      // and covers the OTP path this OAuth-only endpoint doesn't see. Its
      // once-per-account localStorage guard already prevents over-counting.

      // Send welcome email for new users (fire-and-forget)
      if (isNewUser) {
        this.emailService
          .sendWelcomeEmail(dto.email, dto.name, dto.locale)
          .catch((err) =>
            this.logger.error(
              `Failed to send welcome email to ${dto.email}`,
              err,
            ),
          );
      }

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
