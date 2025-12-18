export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface RoomInviteEmailData {
  inviteeName: string;
  inviterName: string;
  roomName: string;
  roomCode: string;
  joinUrl: string;
}

export interface MatchNotificationEmailData {
  userName: string;
  movieTitle: string;
  moviePoster?: string;
  roomName: string;
  roomUrl: string;
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
}

export interface EmailConfig {
  apiKey?: string;
  fromEmail?: string;
  fromName?: string;
  baseUrl?: string;
}
