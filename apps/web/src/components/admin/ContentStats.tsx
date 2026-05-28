import Image from 'next/image';
import { Film, Skull, Sparkles, Tv, Flame, AlertTriangle } from 'lucide-react';
import { Section } from './Section';
import type { ContentStats } from '@/lib/api/admin';

interface ContentStatsProps {
  content: ContentStats | undefined;
  isLoading: boolean;
}

type MovieRow = {
  movieId: string;
  title: string | null;
  posterUrl: string | null;
  year: string | null;
};

function MoviePoster({ url, title }: { url: string | null; title: string | null }) {
  if (!url) {
    return (
      <div className="w-10 h-14 rounded bg-muted/40 flex items-center justify-center text-[9px] text-muted-foreground">
        N/A
      </div>
    );
  }
  return (
    <div className="relative w-10 h-14 rounded overflow-hidden bg-muted/40">
      <Image src={url} alt={title ?? ''} fill sizes="40px" className="object-cover" unoptimized />
    </div>
  );
}

function MovieCell({ movie }: { movie: MovieRow }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <MoviePoster url={movie.posterUrl} title={movie.title} />
      <div className="min-w-0">
        <div className="text-sm font-medium truncate">
          {movie.title ?? <span className="text-muted-foreground">#{movie.movieId}</span>}
        </div>
        <div className="text-[10px] text-muted-foreground">
          {movie.year && <span>{movie.year} · </span>}
          <span className="font-mono">#{movie.movieId}</span>
        </div>
      </div>
    </div>
  );
}

function MovieList<T extends MovieRow>({
  items,
  rightLabel,
  rightValue,
  empty,
}: {
  items: T[];
  rightLabel: string;
  rightValue: (item: T) => string;
  empty: string;
}) {
  if (items.length === 0) {
    return <div className="text-xs text-muted-foreground italic py-2">{empty}</div>;
  }
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border/50 text-xs text-muted-foreground">
          <th className="text-left py-2">Film</th>
          <th className="text-right py-2 whitespace-nowrap">{rightLabel}</th>
        </tr>
      </thead>
      <tbody>
        {items.map((m) => (
          <tr key={m.movieId} className="border-b border-border/30 hover:bg-muted/20">
            <td className="py-2">
              <MovieCell movie={m} />
            </td>
            <td className="text-right font-semibold whitespace-nowrap">{rightValue(m)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ContentStatsPanel({ content, isLoading }: ContentStatsProps) {
  return (
    <Section title="Catalogue / Contenu" loading={isLoading}>
      {content && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-muted/20 rounded-xl p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Film className="w-3.5 h-3.5" />
                <span>Movie rooms</span>
              </div>
              <div className="text-2xl font-bold">
                {content.mediaTypeSplit.movie.toLocaleString()}
              </div>
            </div>
            <div className="bg-muted/20 rounded-xl p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Tv className="w-3.5 h-3.5" />
                <span>TV rooms</span>
              </div>
              <div className="text-2xl font-bold">{content.mediaTypeSplit.tv.toLocaleString()}</div>
            </div>
            <div className="bg-muted/20 rounded-xl p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Genres trackés</span>
              </div>
              <div className="text-2xl font-bold">{content.topGenres.length}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                <Flame className="w-3.5 h-3.5 text-pink-400" />
                <span>Top swipés — les films qui apparaissent le plus dans les decks</span>
              </div>
              <MovieList
                items={content.topSwiped}
                rightLabel="Swipes"
                rightValue={(m) => m.swipeCount.toLocaleString()}
                empty="Pas encore de swipes"
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Controversés — divisent les users (40-60% de likes, ≥20 swipes)</span>
              </div>
              <MovieList
                items={content.controversial}
                rightLabel="Like rate"
                rightValue={(m) => `${m.likeRate}% (${m.totalSwipes} swipes)`}
                empty="Pas assez de signal — il faut au moins 20 swipes par film"
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                <Skull className="w-3.5 h-3.5 text-red-400" />
                <span>
                  Films &laquo;&nbsp;morts&nbsp;&raquo; — swipés ≥20 fois mais jamais matchés
                </span>
              </div>
              <MovieList
                items={content.deadMovies}
                rightLabel="Swipes (likes)"
                rightValue={(m) => `${m.totalSwipes.toLocaleString()} (${m.likes} ♥)`}
                empty="Tous les films swipés ont fait au moins un match — sain"
              />
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-2">
                Top genres — par nombre de rooms qui les ciblent
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-xs text-muted-foreground">
                    <th className="text-left py-2">Genre</th>
                    <th className="text-right py-2">Rooms</th>
                  </tr>
                </thead>
                <tbody>
                  {content.topGenres.map((g) => (
                    <tr key={g.genreId} className="border-b border-border/30">
                      <td className="py-2">
                        {g.name ?? (
                          <span className="text-muted-foreground italic">
                            {g.genreId === 0 ? 'Tous genres' : `#${g.genreId}`}
                          </span>
                        )}
                      </td>
                      <td className="text-right font-semibold">{g.roomCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-2">
              Top providers — services de streaming sélectionnés dans les rooms (FR)
            </div>
            {content.topProviders.length === 0 ? (
              <div className="text-xs text-muted-foreground italic">
                Aucun provider configuré sur les rooms
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {content.topProviders.map((p) => (
                  <div
                    key={p.providerId}
                    className="flex items-center gap-2 bg-muted/20 rounded-lg p-2"
                  >
                    {p.logoUrl ? (
                      <div className="relative w-7 h-7 rounded overflow-hidden shrink-0">
                        <Image
                          src={p.logoUrl}
                          alt={p.name ?? ''}
                          fill
                          sizes="28px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded bg-muted/40 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">
                        {p.name ?? `#${p.providerId}`}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {p.roomCount} room{p.roomCount > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Section>
  );
}
