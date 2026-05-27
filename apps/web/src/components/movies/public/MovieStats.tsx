import type { PublicMovieStats } from '@/lib/movies-public';

type Props = {
  stats: PublicMovieStats | null;
  labels: {
    title: string;
    likeRate: string;
    matchCount: string;
    swipeCount: string;
    empty: string;
  };
};

export function MovieStats({ stats, labels }: Props) {
  if (!stats || !stats.hasEnoughData) {
    return (
      <section
        aria-labelledby="stats-title"
        className="rounded-2xl border border-border/60 bg-card/40 p-6"
      >
        <h2 id="stats-title" className="text-xl font-semibold mb-2">
          {labels.title}
        </h2>
        <p className="text-muted-foreground">{labels.empty}</p>
      </section>
    );
  }

  const likePct = stats.likeRate !== null ? Math.round(stats.likeRate * 100) : null;

  return (
    <section
      aria-labelledby="stats-title"
      className="rounded-2xl border border-border/60 bg-card/40 p-6"
    >
      <h2 id="stats-title" className="text-xl font-semibold mb-4">
        {labels.title}
      </h2>
      <dl className="grid grid-cols-3 gap-4 text-center">
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">
            {labels.likeRate}
          </dt>
          <dd className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {likePct !== null ? `${likePct}%` : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">
            {labels.matchCount}
          </dt>
          <dd className="text-3xl font-bold">{stats.matchCount.toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">
            {labels.swipeCount}
          </dt>
          <dd className="text-3xl font-bold">{stats.swipeCount.toLocaleString()}</dd>
        </div>
      </dl>
    </section>
  );
}
