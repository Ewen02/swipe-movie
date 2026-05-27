import type { MovieBasic, MovieDetails, MovieGenre, MovieWatchProvider } from '@swipe-movie/types';

export type PublicMovieStats = {
  likeRate: number | null;
  swipeCount: number;
  matchCount: number;
  hasEnoughData: boolean;
};

export type MediaType = 'movie' | 'tv';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

/**
 * Map a locale to the TMDb language tag + watch-providers region.
 * Public SEO pages must not depend on per-user auth, so we resolve these
 * server-side from the URL locale alone.
 */
function resolveTmdbContext(locale: string): { language: string; region: string } {
  switch (locale) {
    case 'fr':
      return { language: 'fr-FR', region: 'FR' };
    case 'en':
      return { language: 'en-US', region: 'US' };
    case 'es':
      return { language: 'es-ES', region: 'ES' };
    case 'de':
      return { language: 'de-DE', region: 'DE' };
    case 'it':
      return { language: 'it-IT', region: 'IT' };
    default:
      return { language: 'fr-FR', region: 'FR' };
  }
}

async function publicFetch<T>(path: string, init: { revalidate?: number } = {}): Promise<T | null> {
  try {
    const internalSecret = process.env.INTERNAL_API_SECRET;
    const headers: HeadersInit = {};
    if (internalSecret) {
      headers['X-Internal-Secret'] = internalSecret;
    }

    const res = await fetch(`${API_URL}${path}`, {
      headers,
      next: { revalidate: init.revalidate ?? 86400 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getPublicMovieDetails(
  id: number,
  locale: string,
  type: MediaType = 'movie',
): Promise<MovieDetails | null> {
  const { language, region } = resolveTmdbContext(locale);
  const params = new URLSearchParams({ type, language, region });
  return publicFetch<MovieDetails>(`/movies/${id}?${params.toString()}`, {
    revalidate: 86400, // 24h — TMDb data rarely changes for catalog titles
  });
}

export async function getPublicMovieStats(id: number): Promise<PublicMovieStats | null> {
  return publicFetch<PublicMovieStats>(`/movies/${id}/public-stats`, {
    revalidate: 1800, // 30 min — swipe activity moves faster than TMDb data
  });
}

export async function getPopularMoviesForSitemap(limit = 500): Promise<MovieBasic[]> {
  // 5 TMDb pages × 20 results = 100 ids per call.
  const pagesNeeded = Math.min(Math.ceil(limit / 20), 25);
  const responses = await Promise.all(
    Array.from({ length: pagesNeeded }, (_, i) =>
      publicFetch<MovieBasic[]>(`/movies/popular?page=${i + 1}`, {
        revalidate: 86400,
      }),
    ),
  );
  return responses
    .flatMap((r) => r ?? [])
    .filter((m): m is MovieBasic => Boolean(m?.id))
    .slice(0, limit);
}

export async function getPublicGenres(): Promise<MovieGenre[]> {
  const res = await publicFetch<MovieGenre[]>('/movies/genres', { revalidate: 604800 });
  return res ?? [];
}

export async function getPublicAllProviders(region: string): Promise<MovieWatchProvider[]> {
  const res = await publicFetch<MovieWatchProvider[]>(
    `/movies/providers/all?region=${encodeURIComponent(region)}`,
    { revalidate: 604800 },
  );
  return res ?? [];
}

export type MoviesByGenreOptions = {
  /** TMDB watch provider IDs (e.g. [8] for Netflix). */
  watchProviders?: number[];
  /** ISO country code for watch_region (only honored when watchProviders is set). */
  region?: string;
  /** TMDB result page (defaults to 1). */
  page?: number;
  /** Minimum vote_average (defaults to none). */
  minRating?: number;
  /** Restrict to movies released in a given year window. */
  releaseYearMin?: number;
  releaseYearMax?: number;
};

/**
 * Lists movies for a programmatic genre/provider page. Backed by TMDb /discover
 * via the existing API endpoint. We hit one page (20 movies) per call — enough
 * for SEO listing pages. Use page=2,3 to scale.
 */
export async function getMoviesByGenrePublic(
  genreId: number,
  locale: string,
  options: MoviesByGenreOptions = {},
): Promise<MovieBasic[]> {
  const { region: defaultRegion } = resolveTmdbContext(locale);
  const params = new URLSearchParams({
    type: 'movie',
    page: String(options.page ?? 1),
  });
  if (options.watchProviders && options.watchProviders.length > 0) {
    params.set('watchProviders', options.watchProviders.join(','));
    params.set('watchRegion', options.region ?? defaultRegion);
  }
  if (options.minRating !== undefined) {
    params.set('minRating', String(options.minRating));
  }
  if (options.releaseYearMin !== undefined) {
    params.set('releaseYearMin', String(options.releaseYearMin));
  }
  if (options.releaseYearMax !== undefined) {
    params.set('releaseYearMax', String(options.releaseYearMax));
  }

  const res = await publicFetch<MovieBasic[]>(
    `/movies/genre/${genreId}?${params.toString()}`,
    { revalidate: 43200 }, // 12h — listings drift slowly
  );
  return res ?? [];
}

/**
 * Fetch movies for several genres in parallel and merge them, sorted by
 * popularity * voteAverage as a simple ranking heuristic. Dedups by id.
 * Used by contextual pages that blend e.g. Romance + Comedy + Drama.
 */
export async function getMoviesForContext(
  genreIds: number[],
  locale: string,
  options: MoviesByGenreOptions = {},
): Promise<MovieBasic[]> {
  if (genreIds.length === 0) return [];
  const lists = await Promise.all(
    genreIds.map((id) => getMoviesByGenrePublic(id, locale, options)),
  );

  const seen = new Map<number, MovieBasic>();
  for (const list of lists) {
    for (const m of list) {
      if (!seen.has(m.id)) seen.set(m.id, m);
    }
  }

  return Array.from(seen.values())
    .sort(
      (a, b) =>
        b.popularity * Math.max(b.voteAverage, 1) - a.popularity * Math.max(a.voteAverage, 1),
    )
    .slice(0, 30);
}
