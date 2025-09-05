import 'express';

type JwtUser = { sub?: string; email?: string; roles?: string[] };

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtUser;
  }
}
