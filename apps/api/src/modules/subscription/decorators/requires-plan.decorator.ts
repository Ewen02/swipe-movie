import { SetMetadata } from '@nestjs/common';

/**
 * Decorator to specify minimum required subscription plan for a route
 *
 * Usage:
 * @UseGuards(SubscriptionGuard)
 * @RequiresPlan('pro')
 * async someRoute() {}
 */
export const RequiresPlan = (plan: string) =>
  SetMetadata('requiredPlan', plan);
