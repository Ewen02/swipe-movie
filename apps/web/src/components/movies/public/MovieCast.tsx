import Image from 'next/image';
import type { MovieCast as Cast } from '@swipe-movie/types';

type Props = {
  cast: Cast[];
  title: string;
};

export function MovieCast({ cast, title }: Props) {
  if (!cast || cast.length === 0) return null;
  const top = cast.slice(0, 8);

  return (
    <section
      aria-labelledby="cast-title"
      className="rounded-2xl border border-border/60 bg-card/40 p-6"
    >
      <h2 id="cast-title" className="text-xl font-semibold mb-4">
        {title}
      </h2>
      <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {top.map((m) => (
          <li key={m.id} className="text-center">
            <div className="relative mx-auto aspect-square w-20 overflow-hidden rounded-full bg-muted">
              {m.profilePath ? (
                <Image
                  src={m.profilePath}
                  alt={m.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized
                />
              ) : null}
            </div>
            <div className="mt-2 text-sm font-medium line-clamp-1">{m.name}</div>
            <div className="text-xs text-muted-foreground line-clamp-1">{m.character}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
