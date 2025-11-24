import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
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
 */
@Module({
  imports: [AuthModule],
  controllers: [SubscriptionController],
  providers: [PrismaService, SubscriptionService, SubscriptionGuard],
  exports: [SubscriptionService, SubscriptionGuard],
})
export class SubscriptionModule {}
