import { AuthGuard } from '@nestjs/passport';
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';

/**
 * Combined auth guard that tries JWT first, then falls back to email-header strategy.
 * This allows both traditional JWT auth and Better Auth cookie-based sessions.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard(['jwt', 'email-header']) {
  handleRequest<TUser = unknown>(
    err: Error | null,
    user: TUser,
    info: unknown,
    context: ExecutionContext,
    status?: unknown,
  ): TUser {
    // If we have a user from either strategy, allow the request
    if (user) {
      return user;
    }

    // If both strategies failed, throw the appropriate error
    if (err) {
      throw err;
    }

    throw new UnauthorizedException('Authentication required');
  }
}
