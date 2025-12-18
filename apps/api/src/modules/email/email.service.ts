import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EmailService,
  RoomInviteEmailData,
  MatchNotificationEmailData,
  WeeklyDigestEmailData,
} from '@swipe-movie/email';

@Injectable()
export class NestEmailService {
  private readonly logger = new Logger(NestEmailService.name);
  private readonly emailService: EmailService;

  constructor(private configService: ConfigService) {
    this.emailService = new EmailService(
      {
        apiKey: this.configService.get<string>('RESEND_API_KEY'),
        fromEmail: this.configService.get<string>('EMAIL_FROM') || 'noreply@swipe-movie.com',
        fromName: this.configService.get<string>('EMAIL_FROM_NAME') || 'Swipe Movie',
        baseUrl: this.configService.get<string>('FRONTEND_URL') || 'https://swipe-movie.com',
      },
      process.env.NODE_ENV === 'development',
    );
  }

  async sendRoomInvite(email: string, data: RoomInviteEmailData): Promise<boolean> {
    const result = await this.emailService.sendRoomInvite(email, data);
    if (!result.success) {
      this.logger.error(`Failed to send room invite to ${email}: ${result.error}`);
    }
    return result.success;
  }

  async sendMatchNotification(email: string, data: MatchNotificationEmailData): Promise<boolean> {
    const result = await this.emailService.sendMatchNotification(email, data);
    if (!result.success) {
      this.logger.error(`Failed to send match notification to ${email}: ${result.error}`);
    }
    return result.success;
  }

  async sendWeeklyDigest(email: string, data: WeeklyDigestEmailData): Promise<boolean> {
    const result = await this.emailService.sendWeeklyDigest(email, data);
    if (!result.success) {
      this.logger.error(`Failed to send weekly digest to ${email}: ${result.error}`);
    }
    return result.success;
  }

  async sendWelcomeEmail(email: string, userName: string): Promise<boolean> {
    const result = await this.emailService.sendWelcomeEmail(email, userName);
    if (!result.success) {
      this.logger.error(`Failed to send welcome email to ${email}: ${result.error}`);
    }
    return result.success;
  }
}
