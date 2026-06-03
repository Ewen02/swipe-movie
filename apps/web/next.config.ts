import { withSentryConfig } from '@sentry/nextjs';
import createNextIntlPlugin from 'next-intl/plugin';
import withSerwistInit from '@serwist/next';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

// Service worker (PWA) temporarily DISABLED. Its navigation cache re-fetched the
// whole app shell on every deploy, and during a deploy-heavy stretch that drove
// Vercel Edge Requests / Fast Origin Transfer way over the Hobby quota for very
// little traffic. Re-enable (flip `disable`) once we actually need offline/PWA
// and have scoped the runtime cache to exclude dynamic/protected routes.
const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  disable: true,
});

const nextConfig = {
  images: {
    // Disable Vercel image optimization — TMDB CDN already serves optimized sizes
    // This eliminates all Vercel image transformations (was 5057/5000 quota)
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
  },
  experimental: {
    // Enable optimistic client cache for faster navigation
    optimisticClientCache: true,
    // Rewrite lucide-react barrel imports to per-icon paths so unused icons
    // are tree-shaken out of every bundle.
    optimizePackageImports: ['lucide-react'],
  },
  async headers() {
    return [
      {
        source: '/embed/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://us-assets.i.posthog.com https://eu-assets.i.posthog.com https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://image.tmdb.org https://lh3.googleusercontent.com",
              "font-src 'self'",
              "connect-src 'self' " +
                [
                  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
                  'https://www.google-analytics.com',
                  'https://*.google-analytics.com',
                  'https://*.ingest.sentry.io',
                  'wss://*.ingest.sentry.io',
                  'https://us.i.posthog.com',
                  'https://eu.i.posthog.com',
                  'https://us-assets.i.posthog.com',
                  'https://eu-assets.i.posthog.com',
                  'https://app.posthog.com',
                  'https://accounts.google.com',
                  'https://oauth2.googleapis.com',
                ].join(' '),
              "frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self' https://accounts.google.com",
            ].join('; '),
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

// Wrap config with Serwist, next-intl and Sentry
export default withSentryConfig(withSerwist(withNextIntl(nextConfig)), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: false,
  },
  tunnelRoute: '/monitoring',
  disableLogger: true,
});
