import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global exception filter that sanitizes error responses in production
 * Prevents leaking sensitive information through error messages
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const isProduction = process.env.NODE_ENV === 'production';

    // Log the full error internally (with sanitization)
    if (exception instanceof Error) {
      const sanitizedError = this.sanitizeError(exception);
      this.logger.error(
        `${request.method} ${request.url} - Status: ${status}`,
        sanitizedError.stack,
      );
    }

    // Prepare response
    let message = 'An error occurred';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        error = (exceptionResponse as any).error || error;
      }
    }

    // In production, don't expose stack traces or internal details
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: isProduction ? error : (exception instanceof Error ? exception.name : error),
      message: isProduction && status === 500 ? 'Internal server error' : message,
      ...(isProduction ? {} : { stack: exception instanceof Error ? exception.stack : undefined }),
    };

    response.status(status).json(errorResponse);
  }

  /**
   * Remove sensitive data from errors before logging
   */
  private sanitizeError(error: Error): Error {
    const sanitized = { ...error };

    // Remove potential sensitive data from error messages
    if (sanitized.message) {
      sanitized.message = sanitized.message
        .replace(/password[=:]\s*["']?[\w@#$%^&*()]+["']?/gi, 'password=***')
        .replace(/token[=:]\s*["']?[\w.-]+["']?/gi, 'token=***')
        .replace(/api[_-]?key[=:]\s*["']?[\w-]+["']?/gi, 'api_key=***')
        .replace(/secret[=:]\s*["']?[\w-]+["']?/gi, 'secret=***')
        .replace(/[\w.-]+@[\w.-]+\.\w+/g, '***@***.***'); // email addresses
    }

    return sanitized;
  }
}
