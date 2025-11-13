import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export type JwtPayload = {
  sub: string;
  email: string;
  roles?: string[];
  iss?: string;
  aud?: string;
  exp?: number;
  iat?: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
      issuer: 'swipe-movie-api',
      audience: 'swipe-movie-web',
      ignoreExpiration: false,
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    // Validation des claims requis
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Invalid token claims');
    }

    // Validation du format de l'email
    if (!this.isValidEmail(payload.email)) {
      throw new UnauthorizedException('Invalid email format in token');
    }

    return {
      sub: payload.sub,
      email: payload.email,
      roles: payload.roles ?? [],
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
