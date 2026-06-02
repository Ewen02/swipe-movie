import { Transform } from 'class-transformer';

/**
 * Sanitize string input by trimming whitespace and stripping anything that
 * looks like an HTML tag.
 *
 * We deliberately DO NOT HTML-entity-encode here: the values are stored as-is
 * and rendered by React, which already escapes on output, so encoding at the
 * storage layer is redundant for XSS *and* corrupts ordinary text — it turned
 * "Soirée" into the literal "Soir&eacute;e" for every accented name. Stripping
 * tag-like substrings removes the injection vector while preserving accents,
 * ampersands, and quotes as the user typed them.
 */
export function Sanitize() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;

    // Trim, then remove any <...> sequences (tags / tag-like noise).
    return value.trim().replace(/<[^>]*>/g, '');
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
