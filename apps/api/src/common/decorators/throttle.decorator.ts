import { SetMetadata } from '@nestjs/common';
import { Throttle as NestThrottle } from '@nestjs/throttler';

/**
 * Custom throttle decorator for sensitive endpoints
 * Applies stricter rate limiting (5 requests per minute)
 */
export const ThrottleStrict = () => NestThrottle({ short: { limit: 2, ttl: 1000 }, medium: { limit: 5, ttl: 60000 } });

/**
 * Skip throttling for specific endpoints
 */
export const SkipThrottle = () => SetMetadata('skipThrottle', true);
