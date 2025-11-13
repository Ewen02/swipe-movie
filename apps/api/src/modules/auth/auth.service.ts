import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface TokenUser {
  id: string;
  email: string;
  roles?: string[];
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly jwt: JwtService) {}

  issueToken(user: TokenUser): string {
    this.logger.log(`Issuing token for user ${user.id}`);

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles ?? [],
    };

    try {
      return this.jwt.sign(payload);
    } catch (error) {
      this.logger.error(`Failed to issue token for user ${user.id}`, error);
      throw error;
    }
  }

  verifyToken(token: string): TokenUser | null {
    try {
      const payload = this.jwt.verify(token);
      return {
        id: payload.sub,
        email: payload.email,
        roles: payload.roles ?? [],
      };
    } catch (error) {
      this.logger.warn(`Invalid token verification attempt`, error);
      return null;
    }
  }
}
