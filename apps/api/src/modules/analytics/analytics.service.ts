import {
  Injectable,
  Logger,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostHog } from 'posthog-node';

/**
 * Server-side PostHog. This is the source of truth for "business" events that
 * the backend is the only thing able to assert correctly — a match really
 * happened (transaction in MatchesService), a room was created, an account was
 * created. Tracking them here instead of in the browser removes the double
 * call-sites we had on the client, is immune to ad-blockers, and lets us alias
 * a guest's PostHog identity onto their real account at migration time.
 *
 * The distinctId we send is always the app user id (the JWT `sub`), which is
 * the same value the web client passes to posthog.identify() — so server and
 * client events land on one person.
 *
 * No-ops (and logs once) when POSTHOG_KEY is absent, so dev/test runs don't
 * need PostHog configured.
 */
@Injectable()
export class AnalyticsService implements OnApplicationShutdown {
  private readonly logger = new Logger(AnalyticsService.name);
  private readonly client: PostHog | null;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('POSTHOG_KEY');
    const enabled =
      this.configService.get<string>('POSTHOG_ENABLED') !== 'false';

    if (!apiKey || !enabled) {
      this.client = null;
      this.logger.log(
        'PostHog server-side analytics disabled (no POSTHOG_KEY or POSTHOG_ENABLED=false)',
      );
      return;
    }

    this.client = new PostHog(apiKey, {
      host:
        this.configService.get<string>('POSTHOG_HOST') ||
        'https://eu.i.posthog.com',
      // Small batches: backend events are low-volume and we'd rather not lose
      // them to a long flush window if the process restarts.
      flushAt: 20,
      flushInterval: 10000,
    });
  }

  /**
   * Capture an event for a known user. Fire-and-forget: PostHog batches and
   * flushes in the background, so this never blocks the request path.
   */
  capture(
    distinctId: string,
    event: string,
    properties?: Record<string, unknown>,
  ): void {
    if (!this.client) return;
    try {
      this.client.capture({ distinctId, event, properties });
    } catch (err) {
      this.logger.error(`PostHog capture failed for "${event}": ${err}`);
    }
  }

  /**
   * Merge a guest's anonymous PostHog identity into their real account so the
   * trial swipes/matches stay attached to the converted user. Called once, at
   * trial→account migration.
   */
  alias(distinctId: string, alias: string): void {
    if (!this.client) return;
    try {
      this.client.alias({ distinctId, alias });
    } catch (err) {
      this.logger.error(`PostHog alias failed (${alias}→${distinctId}): ${err}`);
    }
  }

  /**
   * Attach properties to a user. Used to enrich the person profile from the
   * server (e.g. subscription tier) where the client can't see it reliably.
   */
  identify(distinctId: string, properties: Record<string, unknown>): void {
    if (!this.client) return;
    try {
      this.client.identify({ distinctId, properties });
    } catch (err) {
      this.logger.error(`PostHog identify failed for ${distinctId}: ${err}`);
    }
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.client) {
      await this.client.shutdown();
    }
  }
}
