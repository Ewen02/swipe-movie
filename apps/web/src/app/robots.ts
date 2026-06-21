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
      // AI *search* bots that fetch live to answer a user's query are allowed:
      // they drive real visibility (a citation in ChatGPT/Perplexity/Bing) for a
      // bounded number of fetches per actual question.
      {
        userAgent: 'OAI-SearchBot', // ChatGPT Search
        allow: ['/'],
      },
      {
        userAgent: 'ChatGPT-User', // ChatGPT browsing on user request
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
        userAgent: 'Bingbot', // Bing / Copilot
        allow: ['/'],
      },
      // AI *training* crawlers are disallowed. They sweep the entire catalog ×
      // every locale to build training corpora, which (with on-demand ISR) turns
      // each pass into thousands of function invocations + ISR writes + TMDB
      // fetches — the main driver of the Vercel quota blowout — for zero live
      // visibility in return. Blocking them is the cheap, GEO-safe lever: the
      // live search bots above still surface us.
      {
        userAgent: 'GPTBot', // OpenAI training crawler (not ChatGPT Search)
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot', // Common Crawl — feeds many LLM training sets
        disallow: ['/'],
      },
      {
        userAgent: 'ClaudeBot', // Anthropic training crawler
        disallow: ['/'],
      },
      {
        userAgent: 'Claude-Web',
        disallow: ['/'],
      },
      {
        userAgent: 'Google-Extended', // Gemini / Vertex AI training
        disallow: ['/'],
      },
      {
        userAgent: 'Applebot-Extended', // Apple Intelligence training
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
