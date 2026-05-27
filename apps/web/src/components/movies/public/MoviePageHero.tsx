import Image from 'next/image';
import Link from 'next/link';
import type { MovieDetails } from '@swipe-movie/types';

type Props = {
  movie: MovieDetails;
  locale: string;
  director?: string | null;
  labels: {
    director: string;
    runtime: (min: number) => string;
    cta: string;
    ctaHref: string;
  };
};

export function MoviePageHero({ movie, director, labels }: Props) {
  const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null;

  return (
    <header className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/40">
      {movie.backdropUrl ? (
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
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
        </div>
      ) : null}

      <div className="flex flex-col gap-8 p-6 md:p-10 lg:flex-row lg:items-end">
        <div className="relative mx-auto aspect-[2/3] w-full max-w-[260px] shrink-0 overflow-hidden rounded-2xl border border-border/60 shadow-2xl">
          {movie.posterUrl ? (
            <Image
              src={movie.posterUrl}
              alt={`Affiche de ${movie.title}`}
              fill
              sizes="(max-width: 1024px) 260px, 260px"
              priority
              className="object-cover"
              unoptimized
            />
          ) : null}
        </div>

        <div className="flex-1 min-w-0">
          {movie.tagline ? (
            <p className="text-sm uppercase tracking-wide text-primary mb-2">{movie.tagline}</p>
          ) : null}
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            {movie.title}
            {year ? <span className="text-muted-foreground font-normal"> ({year})</span> : null}
          </h1>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
            {movie.voteAverage > 0 ? (
              <span className="inline-flex items-center gap-1">
                <span aria-hidden>★</span>
                <strong className="text-foreground">{movie.voteAverage.toFixed(1)}</strong>
                <span>/10 · {movie.voteCount.toLocaleString()}</span>
              </span>
            ) : null}
            {movie.runtime > 0 ? <span>{labels.runtime(movie.runtime)}</span> : null}
            {movie.genres && movie.genres.length > 0 ? (
              <span>{movie.genres.map((g) => g.name).join(', ')}</span>
            ) : null}
          </div>

          {director ? (
            <p className="text-sm mb-4">
              <span className="text-muted-foreground">{labels.director} </span>
              <strong>{director}</strong>
            </p>
          ) : null}

          {movie.overview ? (
            <p className="text-base leading-relaxed mb-6 max-w-3xl">{movie.overview}</p>
          ) : null}

          <Link
            href={labels.ctaHref}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition"
          >
            {labels.cta}
          </Link>
        </div>
      </div>
    </header>
  );
}
