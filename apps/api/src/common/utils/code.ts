import { randomBytes } from 'crypto';

/**
 * Generates a cryptographically secure random room code
 * @param length Length of the code (default: 6)
 * @returns A random code using uppercase letters and numbers (excluding ambiguous characters)
 */
export function generateRoomCode(length = 6): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excludes I, O, 0, 1 for clarity
  const randomValues = randomBytes(length);

  return Array.from(randomValues)
    .map(byte => chars[byte % chars.length])
    .join('');
}
