import { Resend } from 'resend';
import type {
  SendEmailOptions,
  RoomInviteEmailData,
  MatchNotificationEmailData,
  WeeklyDigestEmailData,
  RoomExpiryReminderEmailData,
  EmailConfig,
} from './types';
import {
  buildRoomInviteEmail,
  buildMatchNotificationEmail,
  buildWeeklyDigestEmail,
  buildRoomExpiryReminderEmail,
  buildWelcomeEmail,
  htmlToText,
} from './templates';
import { t, fill, resolveEmailLocale } from './i18n';

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
        console.log(
          `[EmailService] Would send to ${Array.isArray(to) ? to.join(', ') : to}: ${subject}`,
        );
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

  async sendRoomInvite(
    email: string,
    data: RoomInviteEmailData,
  ): Promise<{ success: boolean; error?: string }> {
    const locale = resolveEmailLocale(data.locale);
    const html = buildRoomInviteEmail(data, this.baseUrl, locale);
    return this.sendEmail({
      to: email,
      subject: fill(t(locale).invite_subject, {
        inviterName: data.inviterName,
        roomName: data.roomName,
      }),
      html,
    });
  }

  async sendMatchNotification(
    email: string,
    data: MatchNotificationEmailData,
  ): Promise<{ success: boolean; error?: string }> {
    const locale = resolveEmailLocale(data.locale);
    const html = buildMatchNotificationEmail(data, this.baseUrl, locale);
    return this.sendEmail({
      to: email,
      subject: fill(t(locale).match_subject, { movieTitle: data.movieTitle }),
      html,
    });
  }

  async sendWeeklyDigest(
    email: string,
    data: WeeklyDigestEmailData,
  ): Promise<{ success: boolean; error?: string }> {
    const locale = resolveEmailLocale(data.locale);
    const html = buildWeeklyDigestEmail(data, this.baseUrl, locale);
    return this.sendEmail({
      to: email,
      subject: t(locale).digest_subject,
      html,
    });
  }

  async sendWelcomeEmail(
    email: string,
    userName: string,
    localeInput?: string | null,
  ): Promise<{ success: boolean; error?: string }> {
    const locale = resolveEmailLocale(localeInput);
    const html = buildWelcomeEmail(userName, this.baseUrl, locale);
    return this.sendEmail({
      to: email,
      subject: fill(t(locale).welcome_subject, { name: userName }),
      html,
    });
  }

  async sendRoomExpiryReminder(
    email: string,
    data: RoomExpiryReminderEmailData,
  ): Promise<{ success: boolean; error?: string }> {
    const locale = resolveEmailLocale(data.locale);
    const html = buildRoomExpiryReminderEmail(data, this.baseUrl, locale);
    return this.sendEmail({
      to: email,
      subject: fill(t(locale).expiry_subject, { roomName: data.roomName }),
      html,
    });
  }
}
