import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to redirect HTTP requests to HTTPS in production
 * Railway and most cloud providers handle this at the edge, but this is an extra layer
 */
@Injectable()
export class HttpsRedirectMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Skip in development
    if (process.env.NODE_ENV !== 'production') {
      return next();
    }

    // Check if request is already HTTPS
    const isHttps =
      req.secure ||
      req.headers['x-forwarded-proto'] === 'https' ||
      req.headers['x-forwarded-ssl'] === 'on';

    if (!isHttps) {
      // Redirect to HTTPS
      const httpsUrl = `https://${req.hostname}${req.url}`;
      return res.redirect(301, httpsUrl);
    }

    next();
  }
}
