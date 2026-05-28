import { Film, Skull, Sparkles, Tv } from 'lucide-react';
import { Section } from './Section';
import type { ContentStats } from '@/lib/api/admin';

interface ContentStatsProps {
  content: ContentStats | undefined;
  isLoading: boolean;
}

function MovieList({
  items,
  rightLabel,
  rightValue,
  empty,
}: {
  items: Array<{ movieId: string } & Record<string, unknown>>;
  rightLabel: string;
  rightValue: (item: Record<string, unknown>) => string | number;
  empty: string;
}) {
  if (items.length === 0) {
    return <div className="text-xs text-muted-foreground italic py-2">{empty}</div>;
  }
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border/50 text-xs text-muted-foreground">
          <th className="text-left py-1.5">TMDB ID</th>
          <th className="text-right py-1.5">{rightLabel}</th>
        </tr>
      </thead>
      <tbody>
        {items.map((m) => (
          <tr key={m.movieId} className="border-b border-border/30 hover:bg-muted/20">
            <td className="py-1.5 font-mono text-xs">{m.movieId}</td>
            <td className="text-right font-semibold">{rightValue(m)}</td>
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
        <div className="space-y-5">
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
                <span>Genres tracked</span>
              </div>
              <div className="text-2xl font-bold">{content.topGenres.length}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
              <div className="text-xs text-muted-foreground mb-2">Top swipés</div>
              <MovieList
                items={content.topSwiped as Array<{ movieId: string } & Record<string, unknown>>}
                rightLabel="Swipes"
                rightValue={(m) => (m.swipeCount as number).toLocaleString()}
                empty="Pas de swipes"
              />
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Controversés (40-60% like, ≥20 swipes)
              </div>
              <MovieList
                items={
                  content.controversial as Array<{ movieId: string } & Record<string, unknown>>
                }
                rightLabel="Like rate"
                rightValue={(m) => `${m.likeRate}% (${m.totalSwipes})`}
                empty="Pas assez de signal"
              />
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                <Skull className="w-3.5 h-3.5" />
                Films &laquo;&nbsp;morts&nbsp;&raquo; (swipés ≥20 fois, 0 match)
              </div>
              <MovieList
                items={content.deadMovies as Array<{ movieId: string } & Record<string, unknown>>}
                rightLabel="Swipes"
                rightValue={(m) =>
                  `${(m.totalSwipes as number).toLocaleString()} (${m.likes} likes)`
                }
                empty="Tous les films swipés ont fait au moins un match"
              />
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-2">Top genres (rooms)</div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-xs text-muted-foreground">
                    <th className="text-left py-1.5">Genre ID</th>
                    <th className="text-right py-1.5">Rooms</th>
                  </tr>
                </thead>
                <tbody>
                  {content.topGenres.map((g) => (
                    <tr key={g.genreId} className="border-b border-border/30">
                      <td className="py-1.5 font-mono text-xs">{g.genreId || '(any)'}</td>
                      <td className="text-right font-semibold">{g.roomCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-2">Top providers (par room)</div>
            {content.topProviders.length === 0 ? (
              <div className="text-xs text-muted-foreground italic">Pas de provider configure</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                {content.topProviders.map((p) => (
                  <div
                    key={p.providerId}
                    className="bg-muted/20 rounded-lg p-2 flex justify-between"
                  >
                    <span className="font-mono">ID {p.providerId}</span>
                    <span className="font-semibold">{p.roomCount}</span>
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
