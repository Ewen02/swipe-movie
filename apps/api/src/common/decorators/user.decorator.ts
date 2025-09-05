import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

type JwtUser = { sub?: string; email?: string; roles?: string[] };

// @User() => renvoie tout l'objet user (ou un champ précis via @User('sub'))
export const User = createParamDecorator(
  (
    data: keyof JwtUser | undefined,
    ctx: ExecutionContext,
  ): JwtUser | JwtUser[keyof JwtUser] | undefined => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = request.user as JwtUser | undefined;
    if (data) return user ? user[data] : undefined;
    return user;
  },
);

export const UserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const sub = (request.user as JwtUser | undefined)?.sub;
    if (!sub) {
      throw new UnauthorizedException('Missing JWT subject');
    }
    return sub;
  },
);
