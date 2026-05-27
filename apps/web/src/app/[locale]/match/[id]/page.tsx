import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n';
import { SITE_NAME, SITE_URL } from '@/lib/seo';
import { getPublicMovieDetails } from '@/lib/movies-public';
import { buildMovieSlug } from '@/lib/slug';

export const dynamicParams = true;
export const revalidate = 3600; // 1 hour

type Params = { locale: string; id: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function getPublicMatch(matchId: string) {
  try {
    const res = await fetch(`${API_URL}/matches/${matchId}/public`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

type MatchStrings = { matchedOn: string; cta: string; tryIt: string; watchOn: string; votes: string };

const STRINGS_FR: MatchStrings = {
  matchedOn: 'Match sur Swipe Movie !',
  cta: 'Essaie Swipe Movie',
  tryIt: 'Trouve ton prochain film entre amis',
  watchOn: 'Ou regarder',
  votes: 'votes',
};

const STRINGS: Record<string, MatchStrings> = {
  fr: STRINGS_FR,
  en: {
    matchedOn: 'Matched on Swipe Movie!',
    cta: 'Try Swipe Movie',
    tryIt: 'Find your next movie with friends',
    watchOn: 'Where to watch',
    votes: 'votes',
  },
  es: {
    matchedOn: 'Match en Swipe Movie!',
    cta: 'Prueba Swipe Movie',
    tryIt: 'Encuentra tu proxima pelicula con amigos',
    watchOn: 'Donde ver',
    votes: 'votos',
  },
  de: {
    matchedOn: 'Match auf Swipe Movie!',
    cta: 'Probiere Swipe Movie',
    tryIt: 'Finde deinen nachsten Film mit Freunden',
    watchOn: 'Wo zu sehen',
    votes: 'Stimmen',
  },
  it: {
    matchedOn: 'Match su Swipe Movie!',
    cta: 'Prova Swipe Movie',
    tryIt: 'Trova il tuo prossimo film con gli amici',
    watchOn: 'Dove guardare',
    votes: 'voti',
  },
};

function getStrings(locale: string): MatchStrings {
  return STRINGS[locale] ?? STRINGS_FR;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, id } = await params;
  const match = await getPublicMatch(id);
  if (!match) return { title: 'Match introuvable' };

  const movieId = parseInt(match.movieId);
  const movie = !isNaN(movieId)
    ? await getPublicMovieDetails(movieId, locale, 'movie')
    : null;

  const t = getStrings(locale);
  const title = movie ? `${movie.title} - ${t.matchedOn}` : t.matchedOn;
  const description = movie?.overview?.slice(0, 160) || t.tryIt;

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/${locale}/match/${id}`,
      title: `${title} | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function PublicMatchPage({ params }: { params: Promise<Params> }) {
  const { locale, id } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  const match = await getPublicMatch(id);
  if (!match) notFound();

  const movieId = parseInt(match.movieId);
  const movie = !isNaN(movieId)
    ? await getPublicMovieDetails(movieId, locale, 'movie')
    : null;

  if (!movie) notFound();

  const t = getStrings(locale);
  const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null;
  const director = movie.crew?.find((c) => c.job === 'Director')?.name ?? null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        {movie.backdropUrl && (
          <div className="absolute inset-0 -z-10 opacity-30">
            <Image
              src={movie.backdropUrl}
              alt=""
              fill
              sizes="100vw"
              priority
              className="object-cover blur-xl"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
          </div>
        )}

        <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
          {/* Match badge */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-lg font-bold">
              <span className="text-2xl" aria-hidden>🎉</span>
              {t.matchedOn}
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Poster */}
            <div className="relative w-full max-w-[280px] aspect-[2/3] rounded-2xl overflow-hidden border border-border/60 shadow-2xl shrink-0">
              {movie.posterUrl && (
                <Image
                  src={movie.posterUrl}
                  alt={movie.title}
                  fill
                  sizes="280px"
                  priority
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold">
                {movie.title}
                {year && <span className="text-muted-foreground font-normal"> ({year})</span>}
              </h1>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm text-muted-foreground">
                {movie.voteAverage > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <span aria-hidden>★</span>
                    <strong className="text-foreground">{movie.voteAverage.toFixed(1)}</strong>/10
                  </span>
                )}
                {movie.runtime > 0 && <span>{Math.floor(movie.runtime / 60)}h{(movie.runtime % 60).toString().padStart(2, '0')}</span>}
                {movie.genres && movie.genres.length > 0 && (
                  <span>{movie.genres.map((g) => g.name).join(', ')}</span>
                )}
              </div>

              {director && (
                <p className="text-sm text-muted-foreground">
                  Directed by <strong className="text-foreground">{director}</strong>
                </p>
              )}

              {match.voteCount > 0 && (
                <p className="text-sm text-pink-500 font-medium">
                  ❤️ {match.voteCount} {t.votes}
                </p>
              )}

              {movie.overview && (
                <p className="text-base leading-relaxed text-muted-foreground line-clamp-4">
                  {movie.overview}
                </p>
              )}

              {/* Watch providers */}
              {movie.watchProviders && movie.watchProviders.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    {t.watchOn}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {movie.watchProviders.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 py-1.5"
                      >
                        {p.logoPath && (
                          <Image
                            src={p.logoPath}
                            alt=""
                            width={24}
                            height={24}
                            className="h-6 w-6 rounded object-contain"
                            unoptimized
                          />
                        )}
                        <span className="text-sm font-medium">{p.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Film page link */}
              <div className="pt-2">
                <Link
                  href={`/${locale}/film/${buildMovieSlug(movie.title, movie.id)}`}
                  className="text-sm text-primary hover:underline"
                >
                  Voir la fiche complete →
                </Link>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              href={`/${locale}/try`}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 text-lg font-bold text-white shadow-lg hover:opacity-90 transition"
            >
              {t.cta}
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">{t.tryIt}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
