import type { MovieDetails } from '@swipe-movie/types';
import type { PublicMovieStats } from '@/lib/movies-public';
import { MoviePageHero } from './MoviePageHero';
import { WatchProviders } from './WatchProviders';
import { MovieStats } from './MovieStats';
import { MovieCast } from './MovieCast';
import { MovieTrailer } from './MovieTrailer';
import { SimilarMovies } from './SimilarMovies';

type Labels = {
  director: string;
  runtime: (min: number) => string;
  cta: string;
  watchProvidersTitle: string;
  watchProvidersEmpty: string;
  castTitle: string;
  trailerTitle: string;
  similarTitle: string;
  statsTitle: string;
  statsLikeRate: string;
  statsMatchCount: string;
  statsSwipeCount: string;
  statsEmpty: string;
  breadcrumbHome: string;
  breadcrumbCatalog: string;
};

type Props = {
  movie: MovieDetails;
  stats: PublicMovieStats | null;
  locale: string;
  type: 'film' | 'serie';
  labels: Labels;
};

export function MediaPage({ movie, stats, locale, type, labels }: Props) {
  const director = movie.crew?.find((c) => c.job === 'Director')?.name ?? null;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 space-y-8 max-w-6xl">
      <nav aria-label="breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <a href={`/${locale}`} className="hover:text-foreground transition">
              {labels.breadcrumbHome}
            </a>
          </li>
          <li aria-hidden>/</li>
          <li>
            <span>{labels.breadcrumbCatalog}</span>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-foreground">
            {movie.title}
          </li>
        </ol>
      </nav>

      <MoviePageHero
        movie={movie}
        director={director}
        locale={locale}
        labels={{
          director: labels.director,
          runtime: labels.runtime,
          cta: labels.cta,
          ctaHref: `/${locale}/login?callbackUrl=/rooms`,
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <WatchProviders
            providers={movie.watchProviders ?? []}
            title={labels.watchProvidersTitle}
            emptyLabel={labels.watchProvidersEmpty}
          />
          <MovieTrailer videos={movie.videos} title={labels.trailerTitle} />
          <MovieCast cast={movie.cast ?? []} title={labels.castTitle} />
        </div>

        <aside className="space-y-6">
          <MovieStats
            stats={stats}
            labels={{
              title: labels.statsTitle,
              likeRate: labels.statsLikeRate,
              matchCount: labels.statsMatchCount,
              swipeCount: labels.statsSwipeCount,
              empty: labels.statsEmpty,
            }}
          />
        </aside>
      </div>

      <SimilarMovies
        movies={movie.similar}
        locale={locale}
        type={type}
        title={labels.similarTitle}
      />
    </div>
  );
}
