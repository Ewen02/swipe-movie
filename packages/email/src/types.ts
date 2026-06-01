export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

/**
 * Recipient's preferred locale (e.g. "fr", "en-US"). Optional everywhere —
 * unresolved/unknown values fall back to the default locale (fr).
 */
export type EmailLocaleInput = string | null | undefined;

export interface RoomInviteEmailData {
  inviteeName: string;
  inviterName: string;
  roomName: string;
  roomCode: string;
  joinUrl: string;
  locale?: EmailLocaleInput;
}

export interface MatchNotificationEmailData {
  userName: string;
  movieTitle: string;
  moviePoster?: string;
  roomName: string;
  roomUrl: string;
  locale?: EmailLocaleInput;
}

export interface WeeklyDigestEmailData {
  userName: string;
  totalSwipes: number;
  newMatches: number;
  topMatch?: {
    title: string;
    poster?: string;
  };
  roomsActive: number;
  locale?: EmailLocaleInput;
}

export interface RoomExpiryReminderEmailData {
  userName: string;
  roomName: string;
  roomUrl: string;
  /** Number of matches already found in the room, to make the reminder concrete. */
  matchCount: number;
  /** Human-readable time left, e.g. "4 heures". */
  timeLeft: string;
  locale?: EmailLocaleInput;
}

export interface EmailConfig {
  apiKey?: string;
  fromEmail?: string;
  fromName?: string;
  baseUrl?: string;
}
