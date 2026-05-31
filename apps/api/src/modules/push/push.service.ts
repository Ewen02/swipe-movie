import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import webpush from 'web-push';
import { PrismaService } from '../../infra/prisma.service';

export interface PushPayload {
  title: string;
  body: string;
  /** Path the notification click should open, e.g. /rooms/ABC123. */
  url?: string;
}

/**
 * Web Push fan-out. Stores nothing itself beyond what's in the DB: given a
 * userId, it sends a payload to every browser subscription that user has
 * registered, and prunes endpoints the push service reports as gone (410/404).
 *
 * Configured only when VAPID keys are present; without them push is a no-op so
 * the rest of the app (and dev environments) keep working.
 */
@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);
  private readonly enabled: boolean;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    const publicKey = this.config.get<string>('VAPID_PUBLIC_KEY');
    const privateKey = this.config.get<string>('VAPID_PRIVATE_KEY');
    const subject =
      this.config.get<string>('VAPID_SUBJECT') ||
      'mailto:noreply@swipe-movie.com';

    this.enabled = !!publicKey && !!privateKey;
    if (this.enabled) {
      webpush.setVapidDetails(subject, publicKey!, privateKey!);
    } else {
      this.logger.warn(
        'VAPID keys not configured — push notifications are disabled (no-op).',
      );
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Send a payload to every push subscription of the given users. Best-effort
   * and never throws: callers use it as a fire-and-forget re-engagement signal.
   * Returns the number of notifications successfully delivered.
   */
  async sendToUsers(userIds: string[], payload: PushPayload): Promise<number> {
    if (!this.enabled || userIds.length === 0) return 0;

    const subscriptions = await this.prisma.pushSubscription.findMany({
      where: { userId: { in: userIds } },
    });
    if (subscriptions.length === 0) return 0;

    const body = JSON.stringify(payload);
    const staleEndpoints: string[] = [];
    let sent = 0;

    await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            body,
          );
          sent++;
        } catch (err: unknown) {
          // 404/410 mean the browser subscription is gone — drop it so we stop
          // trying. Other errors are transient and left in place.
          const statusCode =
            typeof err === 'object' && err !== null && 'statusCode' in err
              ? (err as { statusCode?: number }).statusCode
              : undefined;
          if (statusCode === 404 || statusCode === 410) {
            staleEndpoints.push(sub.endpoint);
          } else {
            this.logger.warn(
              `Push send failed (${statusCode ?? 'unknown'}) for ${sub.endpoint.slice(0, 40)}…`,
            );
          }
        }
      }),
    );

    if (staleEndpoints.length > 0) {
      await this.prisma.pushSubscription.deleteMany({
        where: { endpoint: { in: staleEndpoints } },
      });
      this.logger.log(
        `Pruned ${staleEndpoints.length} dead push subscription(s)`,
      );
    }

    return sent;
  }

  /** Idempotent upsert keyed on the globally-unique endpoint. */
  async saveSubscription(
    userId: string,
    sub: { endpoint: string; keys: { p256dh: string; auth: string } },
  ): Promise<void> {
    await this.prisma.pushSubscription.upsert({
      where: { endpoint: sub.endpoint },
      create: {
        userId,
        endpoint: sub.endpoint,
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth,
      },
      // Re-point an existing endpoint to the current user (e.g. shared device).
      update: { userId, p256dh: sub.keys.p256dh, auth: sub.keys.auth },
    });
  }

  async removeSubscription(userId: string, endpoint: string): Promise<void> {
    await this.prisma.pushSubscription.deleteMany({
      where: { userId, endpoint },
    });
  }
}
