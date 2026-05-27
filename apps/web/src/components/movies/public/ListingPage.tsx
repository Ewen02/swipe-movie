import Link from 'next/link';
import type { MovieBasic } from '@swipe-movie/types';
import { MovieGrid } from './MovieGrid';

export type BreadcrumbItem = { label: string; href?: string };

type Props = {
  title: string;
  intro: string;
  movies: MovieBasic[];
  locale: string;
  emptyLabel: string;
  breadcrumbs: BreadcrumbItem[];
  ctaLabel: string;
  ctaHref: string;
  /** Optional secondary navigation rendered above the grid (sub-genres, related providers, etc.). */
  facets?: React.ReactNode;
};

export function ListingPage({
  title,
  intro,
  movies,
  locale,
  emptyLabel,
  breadcrumbs,
  ctaLabel,
  ctaHref,
  facets,
}: Props) {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 space-y-8 max-w-6xl">
      <nav aria-label="breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          {breadcrumbs.map((b, i) => {
            const isLast = i === breadcrumbs.length - 1;
            return (
              <span key={i} className="flex items-center gap-2">
                {b.href && !isLast ? (
                  <Link href={b.href} className="hover:text-foreground transition">
                    {b.label}
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className={isLast ? 'text-foreground' : ''}
                  >
                    {b.label}
                  </span>
                )}
                {!isLast ? <span aria-hidden>/</span> : null}
              </span>
            );
          })}
        </ol>
      </nav>

      <header className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold">
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {title}
          </span>
        </h1>
        <p className="text-muted-foreground text-base max-w-3xl leading-relaxed">{intro}</p>
        <div>
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition"
          >
            {ctaLabel}
          </Link>
        </div>
      </header>

      {facets}

      <MovieGrid movies={movies} locale={locale} type="film" emptyLabel={emptyLabel} />
    </div>
  );
}
