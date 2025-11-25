# Stripe Configuration Guide

This guide explains how to configure Stripe for Swipe Movie's subscription system.

## Phase 1: Development (Test Mode)

During Phase 1 (beta), Stripe is configured but not active. All users are on the FREE tier.

## Phase 2: Production Activation

### Step 1: Create Stripe Account

1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Create an account (or use existing)
3. Complete business verification
4. Enable test mode for development

### Step 2: Get API Keys

1. Navigate to [Developers > API keys](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Click "Reveal test key" for **Secret key** (starts with `sk_test_`)
4. Add to `.env`:

```bash
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_PUBLISHABLE_KEY=pk_test_51...
```

⚠️ **IMPORTANT**: Never commit real API keys to git!

### Step 3: Create Products & Prices

#### In Stripe Dashboard:

1. Go to [Products > Add Product](https://dashboard.stripe.com/test/products)
2. Create 3 products:

**Product 1: Starter**
- Name: `Swipe Movie - Starter`
- Description: `Unlimited rooms, 8 participants, 50 swipes per room`
- Pricing:
  - Type: Recurring
  - Price: €4.99
  - Billing period: Monthly
  - Currency: EUR
- Click "Save product"
- **Copy the Price ID** (starts with `price_`)

**Product 2: Pro** ⭐ Most Popular
- Name: `Swipe Movie - Pro`
- Description: `Unlimited everything, advanced filters, priority support`
- Pricing:
  - Type: Recurring
  - Price: €9.99
  - Billing period: Monthly
  - Currency: EUR
- Click "Save product"
- **Copy the Price ID**

**Product 3: Team**
- Name: `Swipe Movie - Team`
- Description: `5 team accounts, API access, white-label, analytics`
- Pricing:
  - Type: Recurring
  - Price: €19.99
  - Billing period: Monthly
  - Currency: EUR
- Click "Save product"
- **Copy the Price ID**

#### Update .env with Price IDs:

```bash
STRIPE_PRICE_STARTER=price_1ABC...
STRIPE_PRICE_PRO=price_1XYZ...
STRIPE_PRICE_TEAM=price_1DEF...
```

### Step 4: Configure Webhooks

Webhooks notify your backend when subscription events occur (payments, cancellations, etc.).

#### Local Development (using Stripe CLI):

1. Install Stripe CLI: [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login
```

2. Forward webhooks to local server:

```bash
stripe listen --forward-to localhost:3001/webhooks/stripe
```

3. Copy the webhook signing secret (starts with `whsec_`):

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Production (Stripe Dashboard):

1. Go to [Developers > Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click "Add endpoint"
3. Endpoint URL: `https://api.yourdomain.com/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. Copy the **Signing secret** and add to `.env`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Step 5: Test the Integration

#### Test Checkout Flow:

1. Start your API server:
```bash
cd apps/api
npm run start:dev
```

2. Start Stripe webhook forwarding (separate terminal):
```bash
stripe listen --forward-to localhost:3001/webhooks/stripe
```

3. Use Stripe test cards:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - Use any future expiry date (e.g., 12/34)
   - Use any 3-digit CVC (e.g., 123)

#### Test Webhook Events:

```bash
# Test successful payment
stripe trigger checkout.session.completed

# Test subscription creation
stripe trigger customer.subscription.created

# Test failed payment
stripe trigger invoice.payment_failed
```

#### Verify Webhooks:

Check your API logs for webhook processing:
```
[StripeWebhookController] Processing webhook event: checkout.session.completed
[StripeWebhookController] Checkout completed for user abc123...
```

### Step 6: Enable Customer Portal

The Customer Portal allows users to manage their subscriptions (cancel, update payment method, etc.).

1. Go to [Settings > Billing > Customer portal](https://dashboard.stripe.com/test/settings/billing/portal)
2. Enable portal
3. Configure features:
   - ✅ Cancel subscriptions
   - ✅ Update payment methods
   - ✅ View invoice history
   - ❌ Update subscriptions (disable to prevent plan changes outside your app)
4. Save settings

### Step 7: Production Mode

When ready to launch:

1. **Switch to live mode** in Stripe Dashboard (toggle in top-right)
2. Get **live API keys** from [API keys page](https://dashboard.stripe.com/apikeys)
3. Recreate **products and prices** in live mode (test data doesn't transfer)
4. Update **webhook endpoint** with production URL
5. Update `.env` with **live keys**:

```bash
# Production keys (no _test_ in them)
STRIPE_SECRET_KEY=sk_live_51...
STRIPE_PUBLISHABLE_KEY=pk_live_51...
STRIPE_WEBHOOK_SECRET=whsec_...

STRIPE_PRICE_STARTER=price_live_...
STRIPE_PRICE_PRO=price_live_...
STRIPE_PRICE_TEAM=price_live_...
```

⚠️ **NEVER** commit production keys to git!

## Security Checklist

- [ ] API keys stored in environment variables (not in code)
- [ ] `.env` file added to `.gitignore`
- [ ] Webhook signature verification enabled
- [ ] HTTPS enabled in production
- [ ] Rate limiting configured (already done via ThrottlerGuard)
- [ ] Webhook endpoint doesn't expose sensitive data in logs

## Monitoring & Testing

### Check Subscription Status:

```bash
# Get user subscription
curl http://localhost:3001/subscriptions/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Stripe Dashboard:

- [Payments](https://dashboard.stripe.com/test/payments) - View all transactions
- [Subscriptions](https://dashboard.stripe.com/test/subscriptions) - Manage subscriptions
- [Customers](https://dashboard.stripe.com/test/customers) - View customer data
- [Logs](https://dashboard.stripe.com/test/logs) - Debug webhook events

### Common Issues:

**Webhook signature verification fails:**
- Ensure `STRIPE_WEBHOOK_SECRET` matches your endpoint
- Check that raw body is passed to verification (already configured)

**Subscription not updating:**
- Check webhook logs in Stripe Dashboard
- Verify webhook endpoint is publicly accessible (use ngrok for local dev)
- Ensure events are selected in webhook configuration

**Payment fails:**
- Use test cards from [Stripe testing docs](https://stripe.com/docs/testing)
- Check Stripe logs for detailed error messages

## Cost Breakdown

### Stripe Fees:
- **European cards**: 1.4% + €0.25 per transaction
- **Non-European cards**: 2.9% + €0.25 per transaction
- **No monthly fee** (pay-as-you-go)

### Example with 100 subscribers:
- 100 PRO subscriptions × €9.99 = €999/month revenue
- Stripe fees (1.4% + €0.25) × 100 = €39/month
- **Net revenue**: €960/month

## Resources

- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)
- [PCI Compliance](https://stripe.com/docs/security/guide) (handled by Stripe Checkout)

## Phase 2 Activation Checklist

When ready to activate payments:

- [ ] Stripe account verified
- [ ] Products created in live mode
- [ ] Live API keys added to production `.env`
- [ ] Webhook endpoint configured with production URL
- [ ] Customer Portal enabled
- [ ] Privacy Policy updated with payment terms
- [ ] Terms of Service updated with refund policy
- [ ] TMDB Commercial license active ($149/month)
- [ ] Test transactions completed successfully
- [ ] Monitoring/alerting configured for failed payments

## Support

For Stripe-specific issues:
- Stripe Support: [https://support.stripe.com](https://support.stripe.com)
- Stripe Discord: [https://discord.gg/stripe](https://discord.gg/stripe)

For Swipe Movie integration issues:
- See `ROADMAP_SAAS.md` for implementation details
- Check API logs: `apps/api/src/modules/subscription/`
