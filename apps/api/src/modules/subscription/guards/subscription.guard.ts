import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SubscriptionPlan } from '@prisma/client';
import { SubscriptionService } from '../subscription.service';

/**
 * Guard to protect routes based on subscription plan
 *
 * Usage:
 * @UseGuards(SubscriptionGuard)
 * @RequiresPlan(SubscriptionPlan.PRO)
 * async someRoute() {}
 */
@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPlan = this.reflector.get<SubscriptionPlan>(
      'requiredPlan',
      context.getHandler(),
    );

    if (!requiredPlan) {
      // No plan requirement, allow access
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      throw new ForbiddenException('Authentication required');
    }

    const hasAccess = await this.subscriptionService.hasMinimumPlan(
      user.id,
      requiredPlan,
    );

    if (!hasAccess) {
      const userPlan = await this.subscriptionService.getUserPlan(user.id);
      throw new ForbiddenException(
        `This feature requires ${requiredPlan} plan or higher. Current plan: ${userPlan}`,
      );
    }

    return true;
  }
}
