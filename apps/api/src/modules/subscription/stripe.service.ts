import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

/**
 * Stripe service for payment processing
 *
 * Phase 1: Configuration only (not active)
 * Phase 2: Full implementation with checkout, webhooks
 */
@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe | null = null;
  private readonly isEnabled: boolean;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');

    if (secretKey && !secretKey.includes('your_stripe_secret_key')) {
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2025-11-17.clover',
      });
      this.isEnabled = true;
      this.logger.log('Stripe initialized in test mode');
    } else {
      this.isEnabled = false;
      this.logger.warn(
        'Stripe not configured - payment features disabled (Phase 1)',
      );
    }
  }

  /**
   * Check if Stripe is configured and enabled
   */
  isStripeEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Create Stripe checkout session for subscription
   * Phase 2: Implement full checkout flow
   */
  async createCheckoutSession(params: {
    userId: string;
    userEmail: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<string> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    const { userId, userEmail, priceId, successUrl, cancelUrl } = params;

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      client_reference_id: userId,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
      },
    });

    this.logger.log(`Created checkout session for user ${userId}`);

    return session.url!;
  }

  /**
   * Create Stripe customer
   */
  async createCustomer(params: {
    email: string;
    userId: string;
    name?: string;
  }): Promise<string> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    const customer = await this.stripe.customers.create({
      email: params.email,
      name: params.name,
      metadata: {
        userId: params.userId,
      },
    });

    this.logger.log(`Created Stripe customer for user ${params.userId}`);

    return customer.id;
  }

  /**
   * Create portal session for subscription management
   */
  async createPortalSession(params: {
    customerId: string;
    returnUrl: string;
  }): Promise<string> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer: params.customerId,
      return_url: params.returnUrl,
    });

    return session.url;
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<void> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    await this.stripe.subscriptions.cancel(subscriptionId);

    this.logger.log(`Cancelled subscription ${subscriptionId}`);
  }

  /**
   * Get subscription details
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    return await this.stripe.subscriptions.retrieve(subscriptionId);
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(
    payload: string | Buffer,
    signature: string,
  ): Stripe.Event {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    if (!webhookSecret) {
      throw new Error('Stripe webhook secret not configured');
    }

    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  }

  /**
   * Get Stripe price IDs from config
   */
  getPriceIds(): {
    starter: string;
    pro: string;
    team: string;
  } {
    return {
      starter: this.configService.get<string>('STRIPE_PRICE_STARTER', ''),
      pro: this.configService.get<string>('STRIPE_PRICE_PRO', ''),
      team: this.configService.get<string>('STRIPE_PRICE_TEAM', ''),
    };
  }
}
