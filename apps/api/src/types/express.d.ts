import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      sub: string;
      id: string;
      email: string;
      roles: string[];
    };
  }
}
