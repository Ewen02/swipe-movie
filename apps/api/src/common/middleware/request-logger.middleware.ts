import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    // Skip health checks to avoid log spam
    if (req.originalUrl === '/health') {
      return next();
    }

    const start = Date.now();
    const { method, originalUrl } = req;
    const ip = req.ip || req.connection.remoteAddress;

    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;
      const reqWithUser = req as Request & { user?: { email?: string } };
      const user = reqWithUser.user?.email || '-';

      const message = `${method} ${originalUrl} ${statusCode} ${duration}ms ${user}`;

      if (statusCode >= 500) {
        this.logger.error(message);
      } else if (statusCode >= 400) {
        this.logger.warn(message);
      } else if (duration > 1000) {
        this.logger.warn(`[SLOW] ${message}`);
      } else {
        this.logger.log(message);
      }
    });

    next();
  }
}
