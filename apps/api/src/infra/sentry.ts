import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

export function initializeSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // Adjust sample rate in production
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Profiling sample rate
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Set up profiling
    integrations: [
      nodeProfilingIntegration(),
    ],

    // Only enable in production
    enabled: process.env.NODE_ENV === 'production',

    // Environment
    environment: process.env.NODE_ENV || 'development',

    // Filter out sensitive data
    beforeSend(event, hint) {
      // Don't send in development
      if (process.env.NODE_ENV !== 'production') {
        return null;
      }

      // Remove sensitive headers
      if (event.request?.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
      }

      // Remove sensitive body data
      if (event.request?.data) {
        if (typeof event.request.data === 'object') {
          delete (event.request.data as any).password;
          delete (event.request.data as any).token;
          delete (event.request.data as any).secret;
        }
      }

      return event;
    },
  });
}
