import { Transform } from 'class-transformer';
import * as he from 'he';

/**
 * Sanitize string input by trimming whitespace and encoding HTML entities.
 * Uses the 'he' library for proper HTML entity encoding instead of regex-based stripping.
 */
export function Sanitize() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;

    // Trim whitespace
    let sanitized = value.trim();

    // Encode HTML entities to prevent XSS (converts <, >, &, ", ' to safe entities)
    sanitized = he.encode(sanitized, { useNamedReferences: true });

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
