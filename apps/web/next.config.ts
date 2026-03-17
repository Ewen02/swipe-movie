import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from 'next-intl/plugin';
import withSerwistInit from "@serwist/next";

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
    // Optimize image formats (AVIF is smaller than WebP)
    formats: ['image/avif', 'image/webp'] as ('image/avif' | 'image/webp')[],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Image sizes for srcset
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimize layout shift
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  experimental: {
    // Enable optimistic client cache for faster navigation
    optimisticClientCache: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://us-assets.i.posthog.com https://eu-assets.i.posthog.com https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://image.tmdb.org https://lh3.googleusercontent.com",
              "font-src 'self'",
              "connect-src 'self' " + [
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
              ].join(' '),
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; ')
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
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
  tunnelRoute: "/monitoring",
  disableLogger: true,
});
