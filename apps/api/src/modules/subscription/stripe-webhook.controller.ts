import {
  Controller,
  Post,
  Headers,
  Req,
  Logger,
  HttpCode,
} from '@nestjs/common';
import { Request } from 'express';
import { StripeService } from './stripe.service';
import { SubscriptionService, SubscriptionPlan, SubscriptionStatus } from './subscription.service';
import Stripe from 'stripe';

/**
 * Stripe webhook controller
 *
 * Handles Stripe webhook events for subscription lifecycle
 *
 * Note: Better Auth handles webhooks on the Web app side.
 * This controller is for direct API Stripe integration if needed.
 */
@Controller('webhooks/stripe')
export class StripeWebhookController {
  private readonly logger = new Logger(StripeWebhookController.name);

  constructor(
    private readonly stripeService: StripeService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  /**
   * Webhook endpoint for Stripe events
   * IMPORTANT: Must use raw body for signature verification
   */
  @Post()
  @HttpCode(200)
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: Request & { rawBody?: Buffer },
  ) {
    if (!this.stripeService.isStripeEnabled()) {
      this.logger.warn('Stripe webhook received but Stripe is not enabled');
      return { received: true };
    }

    const payload = request.rawBody;

    if (!payload) {
      this.logger.error('No raw body in webhook request');
      return { error: 'No payload' };
    }

    let event: Stripe.Event;

    try {
      event = this.stripeService.verifyWebhookSignature(payload, signature);
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err}`);
      return { error: 'Invalid signature' };
    }

    this.logger.log(`Processing webhook event: ${event.type}`);

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutCompleted(
            event.data.object as Stripe.Checkout.Session,
          );
          break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(
            event.data.object as Stripe.Subscription,
          );
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(
            event.data.object as Stripe.Subscription,
          );
          break;

        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;

        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
          break;

        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      this.logger.error(`Error processing webhook: ${error}`);
      throw error;
    }

    return { received: true };
  }

  /**
   * Handle successful checkout
   */
  private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId || session.client_reference_id;

    if (!userId) {
      this.logger.error('No userId in checkout session');
      return;
    }

    const subscriptionId = session.subscription as string;

    this.logger.log(
      `Checkout completed for user ${userId}, subscription ${subscriptionId}`,
    );

    // Subscription will be updated via subscription.created event
  }

  /**
   * Handle subscription created/updated
   */
  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;
    const userId = subscription.metadata?.userId;

    if (!userId) {
      this.logger.error('No userId in subscription metadata');
      return;
    }

    const priceId = subscription.items.data[0]?.price.id;
    const plan = this.mapPriceIdToPlan(priceId);
    const status = this.mapStripeStatus(subscription.status);

    // Update or create subscription
    const existingSubscription =
      await this.subscriptionService.getSubscriptionOrNull(userId);

    if (existingSubscription) {
      await this.subscriptionService.updateSubscription(userId, {
        plan,
        status,
        stripeSubscriptionId: subscription.id,
      });
    } else {
      await this.subscriptionService.createSubscription({
        userId,
        plan,
        stripeCustomerId: customerId,
      });
    }

    this.logger.log(
      `Updated subscription for user ${userId} to ${plan} (${status})`,
    );
  }

  /**
   * Handle subscription deleted
   */
  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const userId = subscription.metadata?.userId;

    if (!userId) {
      this.logger.error('No userId in subscription metadata');
      return;
    }

    await this.subscriptionService.updateSubscription(userId, {
      status: SubscriptionStatus.CANCELED,
      plan: SubscriptionPlan.FREE,
    });

    this.logger.log(`Cancelled subscription for user ${userId}`);
  }

  /**
   * Handle successful payment
   */
  private async handlePaymentSucceeded(invoice: Stripe.Invoice) {
    const subscriptionId = (invoice as any).subscription as string | undefined;

    if (!subscriptionId) {
      return;
    }

    this.logger.log(`Payment succeeded for subscription ${subscriptionId}`);
  }

  /**
   * Handle failed payment
   */
  private async handlePaymentFailed(invoice: Stripe.Invoice) {
    const subscriptionId = (invoice as any).subscription as string | undefined;

    if (!subscriptionId) {
      return;
    }

    const subscription =
      await this.stripeService.getSubscription(subscriptionId);
    const userId = subscription.metadata?.userId;

    if (!userId) {
      return;
    }

    await this.subscriptionService.updateSubscription(userId, {
      status: SubscriptionStatus.PAST_DUE,
    });

    this.logger.warn(`Payment failed for user ${userId}`);
  }

  /**
   * Map Stripe price ID to subscription plan
   */
  private mapPriceIdToPlan(priceId: string): string {
    const priceIds = this.stripeService.getPriceIds();

    if (priceId === priceIds.starter) return SubscriptionPlan.STARTER;
    if (priceId === priceIds.pro) return SubscriptionPlan.PRO;
    if (priceId === priceIds.team) return SubscriptionPlan.TEAM;

    return SubscriptionPlan.FREE;
  }

  /**
   * Map Stripe subscription status to our status
   */
  private mapStripeStatus(status: Stripe.Subscription.Status): string {
    switch (status) {
      case 'active':
        return SubscriptionStatus.ACTIVE;
      case 'canceled':
        return SubscriptionStatus.CANCELED;
      case 'past_due':
        return SubscriptionStatus.PAST_DUE;
      case 'trialing':
        return SubscriptionStatus.TRIALING;
      case 'incomplete':
      case 'incomplete_expired':
        return SubscriptionStatus.INCOMPLETE;
      default:
        return SubscriptionStatus.ACTIVE;
    }
  }
}
