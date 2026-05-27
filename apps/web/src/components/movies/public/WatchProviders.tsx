import Image from 'next/image';
import type { MovieWatchProvider } from '@swipe-movie/types';

type Props = {
  providers: MovieWatchProvider[];
  emptyLabel: string;
  title: string;
};

export function WatchProviders({ providers, emptyLabel, title }: Props) {
  if (!providers || providers.length === 0) {
    return (
      <section
        aria-labelledby="watch-providers-title"
        className="rounded-2xl border border-border/60 bg-card/40 p-6"
      >
        <h2 id="watch-providers-title" className="text-xl font-semibold mb-2">
          {title}
        </h2>
        <p className="text-muted-foreground">{emptyLabel}</p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="watch-providers-title"
      className="rounded-2xl border border-border/60 bg-card/40 p-6"
    >
      <h2 id="watch-providers-title" className="text-xl font-semibold mb-4">
        {title}
      </h2>
      <ul className="flex flex-wrap gap-3">
        {providers.map((p) => (
          <li
            key={p.id}
            className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/80 px-3 py-2"
          >
            {p.logoPath ? (
              <Image
                src={p.logoPath}
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 rounded-md object-contain"
                unoptimized
              />
            ) : null}
            <span className="text-sm font-medium">{p.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
