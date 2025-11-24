import { SetMetadata } from '@nestjs/common';
import { SubscriptionPlan } from '@prisma/client';

/**
 * Decorator to specify minimum required subscription plan for a route
 *
 * Usage:
 * @UseGuards(SubscriptionGuard)
 * @RequiresPlan(SubscriptionPlan.PRO)
 * async someRoute() {}
 */
export const RequiresPlan = (plan: SubscriptionPlan) =>
  SetMetadata('requiredPlan', plan);
