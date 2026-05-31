import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { PrismaService } from '../../infra/prisma.service';

/**
 * Strategy that authenticates users via the X-User-Email header.
 * Accepts requests that either:
 * 1. Provide a valid X-Internal-Secret header (server-to-server calls), OR
 * 2. Come from an allowed origin (browser calls proxied through the web app)
 */
@Injectable()
export class EmailHeaderStrategy extends PassportStrategy(
  Strategy,
  'email-header',
) {
  private readonly internalSecret: string;
  private readonly allowedOrigins: string[];

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    super();
    this.internalSecret = this.config.getOrThrow<string>('INTERNAL_API_SECRET');
    this.allowedOrigins = [this.config.get<string>('WEB_ORIGIN')].filter(
      Boolean,
    ) as string[];
  }

  async validate(
    req: Request,
  ): Promise<{ sub: string; email: string; roles: string[] }> {
    // Accept if internal secret is provided (server-to-server)
    const secret = req.headers['x-internal-secret'] as string;
    const origin = req.headers['origin'] as string;
    const referer = req.headers['referer'] as string;

    const hasValidSecret = secret && secret === this.internalSecret;
    const hasValidOrigin = origin && this.allowedOrigins.includes(origin);
    const hasValidReferer =
      referer && this.allowedOrigins.some((o) => referer.startsWith(o));

    if (!hasValidSecret && !hasValidOrigin && !hasValidReferer) {
      throw new UnauthorizedException('Request origin not allowed');
    }

    const email = req.headers['x-user-email'] as string;

    if (!email) {
      throw new UnauthorizedException('Missing X-User-Email header');
    }

    // Validate email format (stricter: min 2-char TLD, max 254 chars)
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(email) || email.length > 254) {
      throw new UnauthorizedException('Invalid email format');
    }

    // Find user in database
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, roles: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      sub: user.id,
      email: user.email,
      roles: user.roles ?? [],
    };
  }
}
