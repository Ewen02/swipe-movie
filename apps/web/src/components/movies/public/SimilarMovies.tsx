import Image from 'next/image';
import Link from 'next/link';
import type { MovieBasic } from '@swipe-movie/types';
import { buildMovieSlug } from '@/lib/slug';

type Props = {
  movies?: MovieBasic[];
  locale: string;
  type: 'film' | 'serie';
  title: string;
};

export function SimilarMovies({ movies, locale, type, title }: Props) {
  if (!movies || movies.length === 0) return null;
  const top = movies.slice(0, 12);

  return (
    <section
      aria-labelledby="similar-title"
      className="rounded-2xl border border-border/60 bg-card/40 p-6"
    >
      <h2 id="similar-title" className="text-xl font-semibold mb-4">
        {title}
      </h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {top.map((m) => (
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
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover transition-transform group-hover:scale-105"
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
                </div>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
