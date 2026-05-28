import { Activity, Clock, Heart, Zap } from 'lucide-react';
import { Section } from './Section';
import type { EngagementStats } from '@/lib/api/admin';

interface EngagementStatsProps {
  engagement: EngagementStats | undefined;
  isLoading: boolean;
}

function StatTile({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: typeof Activity;
}) {
  return (
    <div className="bg-muted/20 rounded-xl p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        <span>{label}</span>
      </div>
      <div className="text-2xl font-bold">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      {hint && <div className="text-[11px] text-muted-foreground mt-0.5">{hint}</div>}
    </div>
  );
}

function fmtMinutes(min: number): string {
  if (min < 60) return `${min}min`;
  if (min < 1440) return `${Math.round(min / 60)}h`;
  return `${Math.round(min / 1440)}j`;
}

function DistributionBar({
  segments,
}: {
  segments: Array<{ label: string; value: number; color: string }>;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  if (total === 0) return <div className="text-xs text-muted-foreground">Pas de donnees</div>;
  return (
    <div className="space-y-2">
      <div className="flex h-3 rounded-full overflow-hidden bg-muted/30">
        {segments.map((s) => (
          <div
            key={s.label}
            className={s.color}
            style={{ width: `${(s.value / total) * 100}%` }}
            title={`${s.label}: ${s.value} (${Math.round((s.value / total) * 100)}%)`}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${s.color}`} />
            <span className="text-muted-foreground">{s.label}</span>
            <span className="font-medium ml-auto">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EngagementStatsPanel({ engagement, isLoading }: EngagementStatsProps) {
  return (
    <Section title="Engagement" loading={isLoading}>
      {engagement && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatTile
              icon={Zap}
              label="Swipes / user (median)"
              value={engagement.swipesPerUser.median}
              hint={`p75 ${engagement.swipesPerUser.p75} · max ${engagement.swipesPerUser.max}`}
            />
            <StatTile
              icon={Clock}
              label="Time to 1er swipe"
              value={fmtMinutes(engagement.timeToFirstSwipeMin.median)}
              hint={`p75 ${fmtMinutes(engagement.timeToFirstSwipeMin.p75)} · n=${engagement.timeToFirstSwipeMin.sampleSize}`}
            />
            <StatTile
              icon={Clock}
              label="Time to 1er match"
              value={fmtMinutes(engagement.timeToFirstMatchMin.median)}
              hint={`p75 ${fmtMinutes(engagement.timeToFirstMatchMin.p75)} · n=${engagement.timeToFirstMatchMin.sampleSize}`}
            />
            <StatTile
              icon={Heart}
              label="Like rate"
              value={`${engagement.likeRate}%`}
              hint={`${engagement.totalLikes.toLocaleString()} likes / ${engagement.totalSwipes.toLocaleString()} swipes`}
            />
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-2">Distribution swipes/user</div>
            <DistributionBar
              segments={[
                {
                  label: '0 (jamais swipé)',
                  value: engagement.distribution.b0,
                  color: 'bg-red-500/60',
                },
                {
                  label: '1-10',
                  value: engagement.distribution.b1_10,
                  color: 'bg-amber-500/60',
                },
                {
                  label: '11-50',
                  value: engagement.distribution.b11_50,
                  color: 'bg-emerald-500/60',
                },
                {
                  label: '51+',
                  value: engagement.distribution.b51_plus,
                  color: 'bg-blue-500/60',
                },
              ]}
            />
          </div>
        </div>
      )}
    </Section>
  );
}
