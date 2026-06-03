import type { MetadataRoute } from 'next';
import { locales, defaultLocale } from '@/i18n';
import { SITE_URL } from '@/lib/seo';
import { buildMovieSlug } from '@/lib/slug';
import { getPopularMoviesForSitemap } from '@/lib/movies-public';
import { listGenres, listProviders } from '@/lib/catalog';
import { listContexts } from '@/lib/contexts';
import { listComparisons } from '@/lib/comparisons';

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
  { path: '/try', changeFrequency: 'monthly', priority: 0.8 },
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries = PUBLIC_PAGES.flatMap((p) =>
    emit(p.path, p.changeFrequency, p.priority, now),
  );

  const genreEntries = listGenres().flatMap((g) =>
    emit(`/genre/${g.slug}`, 'weekly', 0.85, now),
  );

  const platformEntries = listProviders().flatMap((p) =>
    emit(`/plateforme/${p.slug}`, 'weekly', 0.85, now),
  );

  // provider×genre combos are intentionally excluded: they carry `noindex`
  // (see plateforme/[provider]/[genre]/page.tsx) since they hold no unique
  // content vs the standalone /genre and /plateforme pages. Listing them in
  // the sitemap would send Google a contradictory "index this" signal.

  const contextEntries = listContexts().flatMap((c) =>
    emit(`/contexte/${c.slug}`, 'monthly', 0.8, now),
  );

  const comparisonEntries = listComparisons().flatMap((c) =>
    emit(`/comparatif/${c.slug}`, 'monthly', 0.7, now),
  );

  const guideEntries = emit('/guide/choisir-un-film-a-plusieurs', 'monthly', 0.8, now);

  let movieEntries: MetadataRoute.Sitemap = [];
  try {
    const popular = await getPopularMoviesForSitemap(500);
    movieEntries = popular.flatMap((movie) => {
      const slug = buildMovieSlug(movie.title, movie.id);
      return emit(`/film/${slug}`, 'monthly', 0.7, now);
    });
  } catch {
    // API unavailable at build time — emit static entries only
  }

  return [
    ...staticEntries,
    ...genreEntries,
    ...platformEntries,
    ...contextEntries,
    ...comparisonEntries,
    ...guideEntries,
    ...movieEntries,
  ];
}
