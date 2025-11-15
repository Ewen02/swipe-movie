import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as Sentry from '@sentry/nestjs';

@Catch()
export class SentryExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(SentryExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : exception,
      );
    }

    // Send error to Sentry
    if (process.env.NODE_ENV === 'production') {
      // Only send 5xx errors to Sentry (server errors, not client errors)
      if (status >= 500) {
        Sentry.captureException(exception, {
          contexts: {
            http: {
              method: request.method,
              url: request.url,
              status_code: status,
              query_string: JSON.stringify(request.query),
            },
          },
          tags: {
            path: request.url,
            method: request.method,
          },
          user: {
            // Add user context if available
            id: (request as any).user?.id,
            email: (request as any).user?.email,
          },
        });
      }
    }

    // Send response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        typeof message === 'string'
          ? message
          : (message as any).message || 'Internal server error',
    });
  }
}
