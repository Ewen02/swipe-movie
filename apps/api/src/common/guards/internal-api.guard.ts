import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

/**
 * Guard that verifies the X-Internal-Secret header matches the INTERNAL_API_SECRET.
 * Used to protect endpoints that should only be called by the web app (server-to-server).
 */
@Injectable()
export class InternalApiGuard implements CanActivate {
  private readonly secret: string;

  constructor(private readonly config: ConfigService) {
    this.secret = this.config.getOrThrow<string>('INTERNAL_API_SECRET');
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const headerSecret = request.headers['x-internal-secret'] as string;

    if (!headerSecret || headerSecret !== this.secret) {
      throw new UnauthorizedException('Invalid or missing internal API secret');
    }

    return true;
  }
}
