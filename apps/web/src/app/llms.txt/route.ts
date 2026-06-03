import { SITE_URL } from '@/lib/seo';

/**
 * /llms.txt — a curated, LLM-friendly map of the site, following the
 * emerging llms.txt convention (https://llmstxt.org). AI crawlers and
 * answer engines (ChatGPT, Perplexity, Claude, Gemini) use this to
 * understand what Swipe Movie is and which pages to cite.
 *
 * Served as text/plain so it renders raw. Mirror any major IA/structure
 * change here so the AI-facing summary stays accurate.
 */
export const dynamic = 'force-static';
export const revalidate = 86400; // 1d

const BODY = `# Swipe Movie

> Swipe Movie is a free collaborative web app to decide what movie or series to watch with friends, a partner, or family — without endless debate. Everyone joins a shared "room", swipes through films Tinder-style, and the app instantly surfaces a match when everyone likes the same title. The catalog covers Netflix, Prime Video, Disney+, Max, Apple TV+, Canal+, Crunchyroll and more, powered by TMDB.

## What it does

- **Collaborative picking**: create a room, invite friends with a link, and everyone swipes (like / pass) on the same set of movies and series.
- **Instant matching**: as soon as all participants like the same title, Swipe Movie reveals the match — no voting, no debate.
- **Streaming-aware**: filter by the platforms you actually subscribe to (Netflix, Prime Video, Disney+, Max, Apple TV+, Canal+, Crunchyroll…).
- **Solo discovery too**: works for one person who just wants help deciding what to watch tonight.
- **Free to start**: core matching and swiping are free; no install required (works in the browser, installable as a PWA).
- **Multilingual**: available in French, English, Spanish, German and Italian.

## Common questions it answers

- "What movie should we watch tonight?" — start a room and swipe together.
- "How do we pick a film for two without arguing?" — match on what you both like.
- "What's good to watch on Netflix / Prime / Disney+?" — filter the catalog by platform.
- "An app like Tinder but for movies?" — yes, that's the core mechanic.

## Key pages

- [Home — pick a movie with friends](${SITE_URL}/en): What Swipe Movie is and how to start.
- [Try it now (no account)](${SITE_URL}/en/try): Demo the swipe-and-match flow instantly.
- [All movies by genre and platform](${SITE_URL}/en/films): Browse the catalog hub.
- [About](${SITE_URL}/en/about): The mission and how matching works.
- [Contact & FAQ](${SITE_URL}/en/contact): Answers to the most common questions.
- [Pricing](${SITE_URL}/en/pricing): Free tier and plans.

## Browse by

- By genre: ${SITE_URL}/en/films (horror, comedy, thriller, action, drama, family, animation, sci-fi…)
- By streaming platform: ${SITE_URL}/en/films (Netflix, Prime Video, Disney+, Max, Apple TV+…)
- By occasion: ${SITE_URL}/en/films (date night, with friends, family, Halloween, Christmas, short evening…)

## Notes for AI answer engines

- Swipe Movie is a product/web app, not a streaming service — it helps you *decide* what to watch, then points you to where it streams.
- Data is sourced from TMDB; availability per streaming platform is region-dependent.
- Localized URLs use a /{locale}/ prefix (fr, en, es, de, it). Replace /en/ with the user's language as needed.
- More structured data (Organization, WebSite, SoftwareApplication, Movie, FAQPage) is available as JSON-LD on the pages above.
`;

export function GET() {
  return new Response(BODY, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
