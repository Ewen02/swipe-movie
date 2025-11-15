import { Transform } from 'class-transformer';

/**
 * Sanitize string input by trimming whitespace and removing HTML tags
 * Prevents XSS attacks through user input
 */
export function Sanitize() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;

    // Trim whitespace
    let sanitized = value.trim();

    // Remove HTML tags (basic XSS protection)
    sanitized = sanitized.replace(/<[^>]*>/g, '');

    // Remove potentially dangerous characters
    sanitized = sanitized.replace(/[<>'"]/g, '');

    return sanitized;
  });
}

/**
 * Limit string length to prevent payload abuse
 */
export function MaxLength(max: number) {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    return value.slice(0, max);
  });
}
