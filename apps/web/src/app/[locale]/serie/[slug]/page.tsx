import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n';
import { buildLanguageAlternates, SITE_NAME, SITE_URL } from '@/lib/seo';
import { parseMovieSlug, buildMovieSlug } from '@/lib/slug';
import { getPublicMovieDetails, getPublicMovieStats } from '@/lib/movies-public';
import { MediaPage } from '@/components/movies/public/MediaPage';
import { SEOPageTracker } from '@/components/seo/SEOPageTracker';

// On-demand ISR (see film/[slug] for rationale): pages render+cache on first
// request rather than being pre-generated. force-dynamic was only a workaround
// for the missing setRequestLocale below, which is now called in the component.
export const revalidate = 604800; // 7d
export const dynamicParams = true;

type Params = { locale: string; slug: string };

// Series are not in the sitemap (low crawl volume), so nothing is pre-rendered
// at build — but declaring generateStaticParams puts the route on the ISR path
// (●) so on-demand renders are cached and served from the CDN, rather than
// invoking the function on every hit.
export function generateStaticParams(): Params[] {
  return [];
}

const STRINGS = {
  fr: {
    director: 'Créé par',
    runtime: (m: number) => (m > 0 ? `${m} min/épisode` : ''),
    cta: 'Lance une room pour cette série',
    watchProvidersTitle: 'Où regarder',
    watchProvidersEmpty: 'Pas de disponibilité streaming connue dans ta région.',
    castTitle: 'Casting principal',
    trailerTitle: 'Bande-annonce',
    similarTitle: 'Séries similaires',
    statsTitle: 'Sur Swipe Movie',
    statsLikeRate: 'Likes',
    statsMatchCount: 'Matchs',
    statsSwipeCount: 'Swipes',
    statsEmpty: 'Pas encore assez de données — sois parmi les premiers à la swiper.',
    breadcrumbHome: 'Accueil',
    breadcrumbCatalog: 'Séries',
    descIntro: (title: string, year: number | null, genres: string) =>
      `Découvre la série ${title}${year ? ` (${year})` : ''}${genres ? ` · ${genres}` : ''}. Synopsis, casting, bande-annonce et plateformes de streaming.`,
  },
  en: {
    director: 'Created by',
    runtime: (m: number) => (m > 0 ? `${m} min/episode` : ''),
    cta: 'Start a room for this series',
    watchProvidersTitle: 'Where to watch',
    watchProvidersEmpty: 'No streaming availability known for your region.',
    castTitle: 'Top cast',
    trailerTitle: 'Trailer',
    similarTitle: 'Similar series',
    statsTitle: 'On Swipe Movie',
    statsLikeRate: 'Likes',
    statsMatchCount: 'Matches',
    statsSwipeCount: 'Swipes',
    statsEmpty: 'Not enough data yet — be one of the first to swipe it.',
    breadcrumbHome: 'Home',
    breadcrumbCatalog: 'Series',
    descIntro: (title: string, year: number | null, genres: string) =>
      `Discover the series ${title}${year ? ` (${year})` : ''}${genres ? ` · ${genres}` : ''}. Synopsis, cast, trailer and streaming platforms.`,
  },
  es: {
    director: 'Creada por',
    runtime: (m: number) => (m > 0 ? `${m} min/episodio` : ''),
    cta: 'Abre una sala para esta serie',
    watchProvidersTitle: 'Dónde ver',
    watchProvidersEmpty: 'Sin disponibilidad streaming conocida para tu región.',
    castTitle: 'Reparto principal',
    trailerTitle: 'Tráiler',
    similarTitle: 'Series similares',
    statsTitle: 'En Swipe Movie',
    statsLikeRate: 'Likes',
    statsMatchCount: 'Matches',
    statsSwipeCount: 'Swipes',
    statsEmpty: 'Aún no hay suficientes datos — sé de los primeros en deslizar.',
    breadcrumbHome: 'Inicio',
    breadcrumbCatalog: 'Series',
    descIntro: (title: string, year: number | null, genres: string) =>
      `Descubre la serie ${title}${year ? ` (${year})` : ''}${genres ? ` · ${genres}` : ''}. Sinopsis, reparto, tráiler y plataformas de streaming.`,
  },
  de: {
    director: 'Erfunden von',
    runtime: (m: number) => (m > 0 ? `${m} Min/Folge` : ''),
    cta: 'Starte einen Raum für diese Serie',
    watchProvidersTitle: 'Wo zu sehen',
    watchProvidersEmpty: 'Keine Streaming-Verfügbarkeit für deine Region bekannt.',
    castTitle: 'Top-Besetzung',
    trailerTitle: 'Trailer',
    similarTitle: 'Ähnliche Serien',
    statsTitle: 'Auf Swipe Movie',
    statsLikeRate: 'Likes',
    statsMatchCount: 'Matches',
    statsSwipeCount: 'Swipes',
    statsEmpty: 'Noch nicht genug Daten — sei einer der Ersten, die swipen.',
    breadcrumbHome: 'Start',
    breadcrumbCatalog: 'Serien',
    descIntro: (title: string, year: number | null, genres: string) =>
      `Entdecke die Serie ${title}${year ? ` (${year})` : ''}${genres ? ` · ${genres}` : ''}. Synopsis, Besetzung, Trailer und Streaming-Plattformen.`,
  },
  it: {
    director: 'Creata da',
    runtime: (m: number) => (m > 0 ? `${m} min/episodio` : ''),
    cta: 'Apri una room per questa serie',
    watchProvidersTitle: 'Dove guardare',
    watchProvidersEmpty: 'Nessuna disponibilità streaming nota per la tua regione.',
    castTitle: 'Cast principale',
    trailerTitle: 'Trailer',
    similarTitle: 'Serie simili',
    statsTitle: 'Su Swipe Movie',
    statsLikeRate: 'Like',
    statsMatchCount: 'Match',
    statsSwipeCount: 'Swipe',
    statsEmpty: 'Non ancora abbastanza dati — sii tra i primi a swippare.',
    breadcrumbHome: 'Home',
    breadcrumbCatalog: 'Serie',
    descIntro: (title: string, year: number | null, genres: string) =>
      `Scopri la serie ${title}${year ? ` (${year})` : ''}${genres ? ` · ${genres}` : ''}. Sinossi, cast, trailer e piattaforme di streaming.`,
  },
} as const;

function getStrings(locale: string) {
  return STRINGS[locale as Locale] ?? STRINGS.fr;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const parsed = parseMovieSlug(slug);
  if (!parsed) return { title: 'Série introuvable' };

  const movie = await getPublicMovieDetails(parsed.id, locale, 'tv');
  if (!movie) return { title: 'Série introuvable', robots: { index: false } };

  const t = getStrings(locale);
  const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null;
  const genres = (movie.genres ?? []).map((g) => g.name).join(', ');
  const description =
    movie.overview && movie.overview.length > 80
      ? movie.overview.slice(0, 158).trim()
      : t.descIntro(movie.title, year, genres).slice(0, 160);

  const canonicalSlug = buildMovieSlug(movie.title, movie.id);
  const path = `/serie/${canonicalSlug}`;
  const canonical = `${SITE_URL}/${locale}${path}`;

  const indexable = Boolean(movie.posterUrl && movie.overview && movie.overview.length > 40);

  return {
    title: `${movie.title}${year ? ` (${year})` : ''}`,
    description,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      type: 'video.tv_show',
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

export default async function SeriePage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;

  if (!locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);
  const parsed = parseMovieSlug(slug);
  if (!parsed) notFound();

  const [movie, stats] = await Promise.all([
    getPublicMovieDetails(parsed.id, locale, 'tv'),
    getPublicMovieStats(parsed.id),
  ]);

  if (!movie) notFound();

  // Canonical-slug redirect (308) — see film/[slug]/page.tsx for the full rationale.
  // The slug text is cosmetic (only the trailing id is parsed), so without this every
  // slug variant of the same series caches its own ISR entry; crawlers turn that into
  // a quota blowout. One canonical URL → one cached entry.
  const canonicalSlug = buildMovieSlug(movie.title, movie.id);
  if (slug !== canonicalSlug) {
    redirect(`/${locale}/serie/${canonicalSlug}`);
  }

  const t = getStrings(locale);
  const creator = movie.crew?.find((c) => c.job === 'Director' || c.job === 'Writer')?.name ?? null;
  const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: movie.title,
    inLanguage: locale,
    description: movie.overview,
    image: movie.posterUrl || undefined,
    datePublished: movie.releaseDate || undefined,
    genre: (movie.genres ?? []).map((g) => g.name),
    creator: creator ? { '@type': 'Person', name: creator } : undefined,
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
        item: `${SITE_URL}/${locale}/serie/${buildMovieSlug(movie.title, movie.id)}`,
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
      <SEOPageTracker pageType="serie" locale={locale} slug={slug} title={movie.title} tmdbId={movie.id} />
      <MediaPage movie={movie} stats={stats} locale={locale} type="serie" labels={t} />
    </>
  );
}
