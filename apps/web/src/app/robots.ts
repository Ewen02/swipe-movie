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
      // AI crawlers are explicitly allowed so Swipe Movie can surface in
      // ChatGPT, Perplexity, Claude, Gemini & co. They inherit the same
      // public/protected split as `*` via the catch-all rule above, but we
      // list them so the intent is unambiguous (and overrides any future
      // default-deny on AI bots).
      {
        userAgent: 'GPTBot', // ChatGPT / OpenAI
        allow: ['/'],
      },
      {
        userAgent: 'OAI-SearchBot', // ChatGPT Search
        allow: ['/'],
      },
      {
        userAgent: 'ChatGPT-User', // ChatGPT browsing on user request
        allow: ['/'],
      },
      {
        userAgent: 'CCBot', // Common Crawl (feeds many LLMs)
        allow: ['/'],
      },
      {
        userAgent: 'PerplexityBot', // Perplexity
        allow: ['/'],
      },
      {
        userAgent: 'Perplexity-User', // Perplexity live fetch
        allow: ['/'],
      },
      {
        userAgent: 'ClaudeBot', // Anthropic / Claude
        allow: ['/'],
      },
      {
        userAgent: 'Claude-Web',
        allow: ['/'],
      },
      {
        userAgent: 'Google-Extended', // Gemini / Vertex AI training
        allow: ['/'],
      },
      {
        userAgent: 'Applebot-Extended', // Apple Intelligence
        allow: ['/'],
      },
      {
        userAgent: 'Bingbot', // Bing / Copilot
        allow: ['/'],
      },
    ],
    // Next.js generateSitemaps() exposes a sitemap index at /sitemap.xml that
    // references each bucket (/sitemap/0.xml … /sitemap/5.xml). Pointing to the
    // index is the only entry crawlers need.
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
