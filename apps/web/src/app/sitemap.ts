import type { MetadataRoute } from 'next';
import { locales, defaultLocale } from '@/i18n';
import { SITE_URL } from '@/lib/seo';
import { buildMovieSlug } from '@/lib/slug';
import { getPopularMoviesForSitemap } from '@/lib/movies-public';
import { listGenres, listProviders } from '@/lib/catalog';
import { listContexts } from '@/lib/contexts';

// ---------------------------------------------------------------------------
// Sitemap strategy
// ---------------------------------------------------------------------------
// Next.js generateSitemaps() returns N sub-sitemaps with a stable id, served
// at /sitemap/<id>.xml. Next composes them into a sitemap index automatically
// at /sitemap.xml.
//
// We split by content bucket so each one is independent (different revalidate
// cadence, future scale-out) and the index makes the structure visible to
// Search Console:
//   id=0  → static corporate pages (16 URLs)
//   id=1  → genre listings (36 URLs)
//   id=2  → platform listings (16 URLs)
//   id=3  → platform × genre combos (288 URLs)
//   id=4  → contextual landing pages (~20 URLs)
//   id=5  → top popular movies (~1000 URLs, capped — split further if scaling)
// ---------------------------------------------------------------------------

type Bucket = 'pages' | 'genres' | 'platforms' | 'combos' | 'contexts' | 'films';

const BUCKETS: Bucket[] = ['pages', 'genres', 'platforms', 'combos', 'contexts', 'films'];

export async function generateSitemaps(): Promise<Array<{ id: number }>> {
  return BUCKETS.map((_, i) => ({ id: i }));
}

type PageDef = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
};

const PUBLIC_PAGES: PageDef[] = [
  { path: '', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/pricing', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/login', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/films', changeFrequency: 'weekly', priority: 0.9 },
];

function buildAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = `${SITE_URL}/${locale}${path}`;
  }
  languages['x-default'] = `${SITE_URL}/${defaultLocale}${path}`;
  return languages;
}

function emit(
  path: string,
  changeFrequency: PageDef['changeFrequency'],
  priority: number,
  now: Date,
): MetadataRoute.Sitemap {
  const alternates = { languages: buildAlternates(path) };
  return locales.map((locale) => ({
    url: `${SITE_URL}/${locale}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
    alternates,
  }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const bucket = BUCKETS[id];
  if (!bucket) return [];

  const now = new Date();

  switch (bucket) {
    case 'pages':
      return PUBLIC_PAGES.flatMap((p) => emit(p.path, p.changeFrequency, p.priority, now));

    case 'genres':
      return listGenres().flatMap((g) => emit(`/genre/${g.slug}`, 'weekly', 0.85, now));

    case 'platforms':
      return listProviders().flatMap((p) => emit(`/plateforme/${p.slug}`, 'weekly', 0.85, now));

    case 'combos':
      return listProviders().flatMap((p) =>
        listGenres().flatMap((g) => emit(`/plateforme/${p.slug}/${g.slug}`, 'weekly', 0.7, now)),
      );

    case 'contexts':
      return listContexts().flatMap((c) => emit(`/contexte/${c.slug}`, 'monthly', 0.8, now));

    case 'films': {
      const popular = await getPopularMoviesForSitemap(500);
      return popular.flatMap((movie) => {
        const slug = buildMovieSlug(movie.title, movie.id);
        return emit(`/film/${slug}`, 'monthly', 0.7, now);
      });
    }
  }
}
