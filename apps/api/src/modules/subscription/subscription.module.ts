import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { StripeService } from './stripe.service';
import { StripeWebhookController } from './stripe-webhook.controller';
import { SubscriptionGuard } from './guards/subscription.guard';
import { PrismaService } from '../../infra/prisma.service';
import { AuthModule } from '../auth/auth.module';

/**
 * Subscription module
 *
 * Phase 1: Basic subscription management with FREE tier
 * Phase 2: Stripe integration for paid tiers and webhooks
 *
 * Exports:
 * - SubscriptionService: For use in other modules (rooms, etc.)
 * - SubscriptionGuard: For route protection based on plan
 * - StripeService: For payment processing
 */
@Module({
  imports: [AuthModule, ConfigModule],
  controllers: [SubscriptionController, StripeWebhookController],
  providers: [
    PrismaService,
    SubscriptionService,
    StripeService,
    SubscriptionGuard,
  ],
  exports: [SubscriptionService, StripeService, SubscriptionGuard],
})
export class SubscriptionModule {}
