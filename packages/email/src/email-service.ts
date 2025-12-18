import { Resend } from 'resend';
import type {
  SendEmailOptions,
  RoomInviteEmailData,
  MatchNotificationEmailData,
  WeeklyDigestEmailData,
  EmailConfig,
} from './types';
import {
  buildRoomInviteEmail,
  buildMatchNotificationEmail,
  buildWeeklyDigestEmail,
  buildWelcomeEmail,
  htmlToText,
} from './templates';

export class EmailService {
  private readonly resend: Resend | null;
  private readonly fromEmail: string;
  private readonly fromName: string;
  private readonly baseUrl: string;
  private readonly debug: boolean;

  constructor(config: EmailConfig, debug = false) {
    this.resend = config.apiKey ? new Resend(config.apiKey) : null;
    this.fromEmail = config.fromEmail || 'noreply@swipe-movie.com';
    this.fromName = config.fromName || 'Swipe Movie';
    this.baseUrl = config.baseUrl || 'https://swipe-movie.com';
    this.debug = debug;

    if (!this.resend && debug) {
      console.warn('[EmailService] No API key configured - emails will be logged only');
    }
  }

  async sendEmail(options: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
    const { to, subject, html, text, replyTo } = options;

    if (!this.resend) {
      if (this.debug) {
        console.log(`[EmailService] Would send to ${Array.isArray(to) ? to.join(', ') : to}: ${subject}`);
      }
      return { success: true };
    }

    try {
      const result = await this.resend.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text: text || htmlToText(html),
        replyTo,
      });

      if (result.error) {
        return { success: false, error: result.error.message };
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  async sendRoomInvite(email: string, data: RoomInviteEmailData): Promise<{ success: boolean; error?: string }> {
    const html = buildRoomInviteEmail(data, this.baseUrl);
    return this.sendEmail({
      to: email,
      subject: `${data.inviterName} vous invite à rejoindre "${data.roomName}" sur Swipe Movie`,
      html,
    });
  }

  async sendMatchNotification(email: string, data: MatchNotificationEmailData): Promise<{ success: boolean; error?: string }> {
    const html = buildMatchNotificationEmail(data, this.baseUrl);
    return this.sendEmail({
      to: email,
      subject: `Nouveau match : ${data.movieTitle}`,
      html,
    });
  }

  async sendWeeklyDigest(email: string, data: WeeklyDigestEmailData): Promise<{ success: boolean; error?: string }> {
    const html = buildWeeklyDigestEmail(data, this.baseUrl);
    return this.sendEmail({
      to: email,
      subject: `Votre semaine sur Swipe Movie`,
      html,
    });
  }

  async sendWelcomeEmail(email: string, userName: string): Promise<{ success: boolean; error?: string }> {
    const html = buildWelcomeEmail(userName, this.baseUrl);
    return this.sendEmail({
      to: email,
      subject: `Bienvenue sur Swipe Movie, ${userName} !`,
      html,
    });
  }
}
