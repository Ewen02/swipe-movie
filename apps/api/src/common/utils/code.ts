import { randomBytes } from 'crypto';
import { ROOM_CODE_LENGTH, ROOM_CODE_CHARS } from '@swipe-movie/types';

/**
 * Generates a cryptographically secure random room code
 * @param length Length of the code (default: ROOM_CODE_LENGTH)
 * @returns A random code using uppercase letters and numbers (excluding ambiguous characters)
 */
export function generateRoomCode(length = ROOM_CODE_LENGTH): string {
  const randomValues = randomBytes(length);

  return Array.from(randomValues)
    .map((byte) => ROOM_CODE_CHARS[byte % ROOM_CODE_CHARS.length])
    .join('');
}
