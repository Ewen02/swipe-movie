import Image from 'next/image';
import Link from 'next/link';
import type { MovieBasic } from '@swipe-movie/types';
import { buildMovieSlug } from '@/lib/slug';

type Props = {
  movies: MovieBasic[];
  locale: string;
  type: 'film' | 'serie';
  emptyLabel: string;
};

export function MovieGrid({ movies, locale, type, emptyLabel }: Props) {
  if (!movies || movies.length === 0) {
    return (
      <p className="rounded-2xl border border-border/60 bg-card/40 p-6 text-center text-muted-foreground">
        {emptyLabel}
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {movies.map((m, idx) => (
        <li key={m.id}>
          <Link
            href={`/${locale}/${type}/${buildMovieSlug(m.title, m.id)}`}
            className="group block"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted">
              {m.posterUrl ? (
                <Image
                  src={m.posterUrl}
                  alt={`Affiche de ${m.title}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover transition-transform group-hover:scale-105"
                  priority={idx < 5}
                  unoptimized
                />
              ) : null}
            </div>
            <div className="mt-2 text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
              {m.title}
            </div>
            {m.releaseDate ? (
              <div className="text-xs text-muted-foreground">
                {new Date(m.releaseDate).getFullYear()}
                {m.voteAverage > 0 ? ` · ★ ${m.voteAverage.toFixed(1)}` : ''}
              </div>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
