import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}
  issueToken(user: { id: string; email: string; roles?: string[] }) {
    return this.jwt.sign({
      sub: user.id,
      email: user.email,
      roles: user.roles ?? [],
    });
  }
}
