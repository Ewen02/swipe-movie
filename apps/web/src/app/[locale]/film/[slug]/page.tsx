import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n';
import { buildLanguageAlternates, SITE_NAME, SITE_URL } from '@/lib/seo';
import { parseMovieSlug, buildMovieSlug } from '@/lib/slug';
import { getPublicMovieDetails, getPublicMovieStats } from '@/lib/movies-public';
import { MediaPage } from '@/components/movies/public/MediaPage';
import { SEOPageTracker } from '@/components/seo/SEOPageTracker';

// Allow on-demand generation for new slugs (ISR).
export const dynamicParams = true;
// Re-fetch at most every 24h per slug.
export const revalidate = 86400;

type Params = { locale: string; slug: string };

const STRINGS = {
  fr: {
    director: 'Réalisé par',
    runtime: (m: number) => `${Math.floor(m / 60)}h${(m % 60).toString().padStart(2, '0')}`,
    cta: 'Lance une room pour ce film',
    watchProvidersTitle: 'Où regarder',
    watchProvidersEmpty: 'Pas de disponibilité streaming connue dans ta région.',
    castTitle: 'Casting principal',
    trailerTitle: 'Bande-annonce',
    similarTitle: 'Films similaires',
    statsTitle: 'Sur Swipe Movie',
    statsLikeRate: 'Likes',
    statsMatchCount: 'Matchs',
    statsSwipeCount: 'Swipes',
    statsEmpty: 'Pas encore assez de données — sois parmi les premiers à le swiper.',
    breadcrumbHome: 'Accueil',
    breadcrumbCatalog: 'Films',
    descIntro: (title: string, year: number | null, runtime: string, genres: string) =>
      `Découvre ${title}${year ? ` (${year})` : ''}${runtime ? ` · ${runtime}` : ''}${genres ? ` · ${genres}` : ''}. Synopsis, casting, bande-annonce et plateformes de streaming.`,
  },
  en: {
    director: 'Directed by',
    runtime: (m: number) => `${Math.floor(m / 60)}h ${(m % 60).toString().padStart(2, '0')}m`,
    cta: 'Start a room for this movie',
    watchProvidersTitle: 'Where to watch',
    watchProvidersEmpty: 'No streaming availability known for your region.',
    castTitle: 'Top cast',
    trailerTitle: 'Trailer',
    similarTitle: 'Similar movies',
    statsTitle: 'On Swipe Movie',
    statsLikeRate: 'Likes',
    statsMatchCount: 'Matches',
    statsSwipeCount: 'Swipes',
    statsEmpty: 'Not enough data yet — be one of the first to swipe it.',
    breadcrumbHome: 'Home',
    breadcrumbCatalog: 'Movies',
    descIntro: (title: string, year: number | null, runtime: string, genres: string) =>
      `Discover ${title}${year ? ` (${year})` : ''}${runtime ? ` · ${runtime}` : ''}${genres ? ` · ${genres}` : ''}. Synopsis, cast, trailer and streaming platforms.`,
  },
  es: {
    director: 'Dirigida por',
    runtime: (m: number) => `${Math.floor(m / 60)}h ${(m % 60).toString().padStart(2, '0')}m`,
    cta: 'Abre una sala para esta película',
    watchProvidersTitle: 'Dónde ver',
    watchProvidersEmpty: 'Sin disponibilidad streaming conocida para tu región.',
    castTitle: 'Reparto principal',
    trailerTitle: 'Tráiler',
    similarTitle: 'Películas similares',
    statsTitle: 'En Swipe Movie',
    statsLikeRate: 'Likes',
    statsMatchCount: 'Matches',
    statsSwipeCount: 'Swipes',
    statsEmpty: 'Aún no hay suficientes datos — sé de los primeros en deslizar.',
    breadcrumbHome: 'Inicio',
    breadcrumbCatalog: 'Películas',
    descIntro: (title: string, year: number | null, runtime: string, genres: string) =>
      `Descubre ${title}${year ? ` (${year})` : ''}${runtime ? ` · ${runtime}` : ''}${genres ? ` · ${genres}` : ''}. Sinopsis, reparto, tráiler y plataformas de streaming.`,
  },
  de: {
    director: 'Regie',
    runtime: (m: number) => `${Math.floor(m / 60)}h ${(m % 60).toString().padStart(2, '0')}m`,
    cta: 'Starte einen Raum für diesen Film',
    watchProvidersTitle: 'Wo zu sehen',
    watchProvidersEmpty: 'Keine Streaming-Verfügbarkeit für deine Region bekannt.',
    castTitle: 'Top-Besetzung',
    trailerTitle: 'Trailer',
    similarTitle: 'Ähnliche Filme',
    statsTitle: 'Auf Swipe Movie',
    statsLikeRate: 'Likes',
    statsMatchCount: 'Matches',
    statsSwipeCount: 'Swipes',
    statsEmpty: 'Noch nicht genug Daten — sei einer der Ersten, die swipen.',
    breadcrumbHome: 'Start',
    breadcrumbCatalog: 'Filme',
    descIntro: (title: string, year: number | null, runtime: string, genres: string) =>
      `Entdecke ${title}${year ? ` (${year})` : ''}${runtime ? ` · ${runtime}` : ''}${genres ? ` · ${genres}` : ''}. Synopsis, Besetzung, Trailer und Streaming-Plattformen.`,
  },
  it: {
    director: 'Diretto da',
    runtime: (m: number) => `${Math.floor(m / 60)}h${(m % 60).toString().padStart(2, '0')}`,
    cta: 'Apri una room per questo film',
    watchProvidersTitle: 'Dove guardare',
    watchProvidersEmpty: 'Nessuna disponibilità streaming nota per la tua regione.',
    castTitle: 'Cast principale',
    trailerTitle: 'Trailer',
    similarTitle: 'Film simili',
    statsTitle: 'Su Swipe Movie',
    statsLikeRate: 'Like',
    statsMatchCount: 'Match',
    statsSwipeCount: 'Swipe',
    statsEmpty: 'Non ancora abbastanza dati — sii tra i primi a swippare.',
    breadcrumbHome: 'Home',
    breadcrumbCatalog: 'Film',
    descIntro: (title: string, year: number | null, runtime: string, genres: string) =>
      `Scopri ${title}${year ? ` (${year})` : ''}${runtime ? ` · ${runtime}` : ''}${genres ? ` · ${genres}` : ''}. Sinossi, cast, trailer e piattaforme di streaming.`,
  },
} as const;

function getStrings(locale: string) {
  return STRINGS[locale as Locale] ?? STRINGS.fr;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const parsed = parseMovieSlug(slug);
  if (!parsed) return { title: 'Film introuvable' };

  const movie = await getPublicMovieDetails(parsed.id, locale, 'movie');
  if (!movie) return { title: 'Film introuvable', robots: { index: false } };

  const t = getStrings(locale);
  const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null;
  const runtime = movie.runtime > 0 ? t.runtime(movie.runtime) : '';
  const genres = (movie.genres ?? []).map((g) => g.name).join(', ');
  const description =
    movie.overview && movie.overview.length > 80
      ? movie.overview.slice(0, 158).trim()
      : t.descIntro(movie.title, year, runtime, genres).slice(0, 160);

  const canonicalSlug = buildMovieSlug(movie.title, movie.id);
  const path = `/film/${canonicalSlug}`;
  const canonical = `${SITE_URL}/${locale}${path}`;

  // No poster or no overview → keep page accessible but block indexation.
  const indexable = Boolean(movie.posterUrl && movie.overview && movie.overview.length > 40);

  return {
    title: `${movie.title}${year ? ` (${year})` : ''}`,
    description,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      type: 'video.movie',
      url: canonical,
      title: `${movie.title}${year ? ` (${year})` : ''} | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
      images: movie.backdropUrl ? [{ url: movie.backdropUrl, alt: movie.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${movie.title}${year ? ` (${year})` : ''}`,
      description,
      images: movie.backdropUrl ? [movie.backdropUrl] : undefined,
    },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale, slug: 'placeholder-0' })).slice(0, 0);
}

export default async function FilmPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;

  if (!locales.includes(locale as Locale)) notFound();
  const parsed = parseMovieSlug(slug);
  if (!parsed) notFound();

  const [movie, stats] = await Promise.all([
    getPublicMovieDetails(parsed.id, locale, 'movie'),
    getPublicMovieStats(parsed.id),
  ]);

  if (!movie) notFound();

  // Permanent-canonical-redirect: if the slug portion drifted, rebuild URL on next nav.
  // We keep server rendering (no redirect) to avoid losing inbound links — Google will pick
  // the canonical via the metadata above.

  const t = getStrings(locale);
  const director = movie.crew?.find((c) => c.job === 'Director')?.name ?? null;
  const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    inLanguage: locale,
    description: movie.overview,
    image: movie.posterUrl || undefined,
    datePublished: movie.releaseDate || undefined,
    duration: movie.runtime > 0 ? `PT${movie.runtime}M` : undefined,
    genre: (movie.genres ?? []).map((g) => g.name),
    director: director ? { '@type': 'Person', name: director } : undefined,
    actor: (movie.cast ?? []).slice(0, 5).map((c) => ({
      '@type': 'Person',
      name: c.name,
    })),
    aggregateRating:
      movie.voteCount > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: movie.voteAverage.toFixed(1),
            ratingCount: movie.voteCount,
            bestRating: 10,
            worstRating: 0,
          }
        : undefined,
    sameAs: movie.externalIds?.imdbId
      ? [`https://www.imdb.com/title/${movie.externalIds.imdbId}/`]
      : undefined,
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.breadcrumbHome, item: `${SITE_URL}/${locale}` },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${movie.title}${year ? ` (${year})` : ''}`,
        item: `${SITE_URL}/${locale}/film/${buildMovieSlug(movie.title, movie.id)}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <SEOPageTracker pageType="film" locale={locale} slug={slug} title={movie.title} tmdbId={movie.id} />
      <MediaPage movie={movie} stats={stats} locale={locale} type="film" labels={t} />
    </>
  );
}
