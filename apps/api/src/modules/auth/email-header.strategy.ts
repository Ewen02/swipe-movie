import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { PrismaService } from '../../infra/prisma.service';

/**
 * Strategy that authenticates users via the X-User-Email header.
 * This is used when the frontend authenticates with Better Auth (cookie-based)
 * and passes the user's email to the backend for identification.
 */
@Injectable()
export class EmailHeaderStrategy extends PassportStrategy(Strategy, 'email-header') {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async validate(req: Request): Promise<{ sub: string; email: string; roles: string[] }> {
    const email = req.headers['x-user-email'] as string;

    if (!email) {
      throw new UnauthorizedException('Missing X-User-Email header');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
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
