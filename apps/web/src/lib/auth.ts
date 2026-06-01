import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { magicLink } from 'better-auth/plugins';
import { stripe } from '@better-auth/stripe';
import Stripe from 'stripe';
import { prisma } from '@swipe-movie/database';
import { EmailService } from '@swipe-movie/email';

// Initialize Stripe client (only if configured)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeClient =
  stripeSecretKey && !stripeSecretKey.includes('your_stripe')
    ? new Stripe(stripeSecretKey, { apiVersion: '2025-11-17.clover' })
    : null;

/**
 * Fetch with retry logic for resilience against temporary network issues
 */
async function fetchWithRetry(url: string, options: RequestInit, retries = 2): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok || i === retries) {
        return response;
      }
      // Wait before retry with exponential backoff: 1s, 2s, 4s
      await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, i)));
    } catch (error) {
      if (i === retries) throw error;
      // Wait before retry with exponential backoff
      await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
  throw new Error('Max retries reached');
}

const SUPPORTED_EMAIL_LOCALES = ['fr', 'en', 'es', 'de', 'it'];

/**
 * Best-effort resolution of the user's locale at signup, from the request that
 * triggered account creation. Checks next-intl's NEXT_LOCALE cookie first, then
 * the path prefix (/es/...), then Accept-Language. Returns undefined when
 * nothing matches so the API can apply its own default.
 */
function resolveSignupLocale(request?: Request): string | undefined {
  if (!request) return undefined;

  const normalize = (value?: string | null): string | undefined => {
    if (!value) return undefined;
    const short = value.toLowerCase().split('-')[0] ?? '';
    return SUPPORTED_EMAIL_LOCALES.includes(short) ? short : undefined;
  };

  // 1. NEXT_LOCALE cookie (set by next-intl when the user switches language)
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const match = cookieHeader.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/);
    const fromCookie = normalize(match?.[1]);
    if (fromCookie) return fromCookie;
  }

  // 2. URL path prefix, e.g. https://swipe-movie.com/es/signin
  try {
    const segment = new URL(request.url).pathname.split('/')[1];
    const fromPath = normalize(segment);
    if (fromPath) return fromPath;
  } catch {
    // ignore malformed URL
  }

  // 3. Accept-Language header (first listed language)
  const accept = request.headers.get('accept-language');
  const fromAccept = normalize(accept?.split(',')[0]);
  if (fromAccept) return fromAccept;

  return undefined;
}

// Get the base URL for Better Auth
const getAuthBaseURL = () => {
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
};

export const auth = betterAuth({
  baseURL: getAuthBaseURL(),
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  trustedOrigins: [
    'https://swipe-movie.com',
    'https://www.swipe-movie.com',
    process.env.BETTER_AUTH_URL || '',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
  ].filter(Boolean),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes cache
    },
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  advanced: {
    cookiePrefix: 'swipe-movie',
    useSecureCookies: process.env.NODE_ENV === 'production',
  },
  plugins: [
    nextCookies(),
    // Email magic link — only wired when Resend is configured so dev/CI
    // without an API key doesn't crash on import.
    ...(process.env.RESEND_API_KEY
      ? [
          magicLink({
            sendMagicLink: async ({ email, url }) => {
              const emailService = new EmailService(
                {
                  apiKey: process.env.RESEND_API_KEY,
                  fromEmail: process.env.EMAIL_FROM || 'noreply@swipe-movie.com',
                  fromName: 'Swipe Movie',
                  baseUrl: getAuthBaseURL(),
                },
                process.env.NODE_ENV !== 'production',
              );
              await emailService.sendEmail({
                to: email,
                subject: 'Connecte-toi à Swipe Movie',
                html: `
                  <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
                    <h1 style="font-size: 22px;">Ton lien de connexion</h1>
                    <p>Clique sur le bouton ci-dessous pour te connecter. Le lien expire dans 5 minutes.</p>
                    <p style="margin: 32px 0;">
                      <a href="${url}" style="background:#000; color:#fff; padding:12px 24px; border-radius:8px; text-decoration:none; display:inline-block;">
                        Me connecter
                      </a>
                    </p>
                    <p style="color:#666; font-size:13px;">Si tu n'as pas demandé ce lien, ignore cet email.</p>
                  </div>
                `,
                text: `Connecte-toi à Swipe Movie : ${url}`,
              });
            },
          }),
        ]
      : []),
    // Stripe plugin for subscription management
    ...(stripeClient
      ? [
          stripe({
            stripeClient,
            stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
            createCustomerOnSignUp: true,
            subscription: {
              enabled: true,
              plans: [
                {
                  name: 'pro',
                  priceId: process.env.STRIPE_PRICE_PRO_MONTHLY!,
                  annualDiscountPriceId: process.env.STRIPE_PRICE_PRO_ANNUAL,
                },
              ],
            },
          }),
        ]
      : []),
  ],
  // Callbacks to sync with backend API
  databaseHooks: {
    user: {
      create: {
        after: async (user, context) => {
          // Sync user with backend API when a new user is created
          try {
            // Capture the signup locale so transactional emails (welcome,
            // match, digest…) go out in the user's language. next-intl stores
            // it in the NEXT_LOCALE cookie; fall back to the Accept-Language
            // header, then to fr on the API side.
            const locale = resolveSignupLocale(context?.request);

            await fetchWithRetry(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth-upsert`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(process.env.INTERNAL_API_SECRET && {
                    'X-Internal-Secret': process.env.INTERNAL_API_SECRET,
                  }),
                },
                body: JSON.stringify({
                  email: user.email,
                  name: user.name ?? user.email?.split('@')[0] ?? 'User',
                  locale,
                }),
              },
              2,
            );
            console.log(`[WEB] [Better Auth] User synced with backend: ${user.email}`);
          } catch (e) {
            console.error('[WEB] [Better Auth] Failed to sync user with backend:', e);
            // Don't block auth flow on backend sync failure
          }
        },
      },
    },
  },
});

// Type exports for client usage
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
