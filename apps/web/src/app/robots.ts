import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: [
          '/api/',
          '/*/discover',
          '/*/library',
          '/*/settings',
          '/*/admin',
          '/*/onboarding',
          '/*/rooms/',
          '/*/dashboard',
          '/*/auth/',
          '/*/preview',
          '/monitoring',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'],
      },
    ],
    // Next.js generateSitemaps() exposes a sitemap index at /sitemap.xml that
    // references each bucket (/sitemap/0.xml … /sitemap/5.xml). Pointing to the
    // index is the only entry crawlers need.
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
