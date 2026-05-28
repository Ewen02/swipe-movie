import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Activity,
  TrendingUp,
  Calendar,
  Home,
  Zap,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
  Ghost,
} from 'lucide-react';
import { fadeInUp } from '@/lib/animations';
import type { AdminStats, DailyActivityData } from '@/lib/api/admin';

interface KPICardsProps {
  stats: AdminStats;
  activity?: DailyActivityData;
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 60;
  const h = 20;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 2) - 1;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={w} height={h} className="opacity-60">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrendBadge({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) return null;
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct === 0) return null;
  const isUp = pct > 0;

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
        isUp ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
      }`}
    >
      {isUp ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
      {Math.abs(pct)}%
    </span>
  );
}

const KPI_CONFIG = [
  {
    key: 'totalUsers',
    label: 'Users authentifiés',
    icon: Users,
    color: 'bg-blue-500/20 text-blue-400',
    sparkColor: '#3b82f6',
  },
  {
    key: 'totalGuests',
    label: 'Guests actifs',
    icon: Ghost,
    color: 'bg-slate-500/20 text-slate-300',
    sparkColor: '#94a3b8',
  },
  {
    key: 'activeToday',
    label: "Actifs aujourd'hui",
    icon: Activity,
    color: 'bg-green-500/20 text-green-400',
    sparkColor: '#22c55e',
  },
  {
    key: 'activeWeek',
    label: 'Actifs 7j',
    icon: TrendingUp,
    color: 'bg-emerald-500/20 text-emerald-400',
    sparkColor: '#10b981',
  },
  {
    key: 'activeMonth',
    label: 'Actifs 30j',
    icon: Calendar,
    color: 'bg-purple-500/20 text-purple-400',
    sparkColor: '#a855f7',
  },
  {
    key: 'totalRooms',
    label: 'Rooms',
    icon: Home,
    color: 'bg-orange-500/20 text-orange-400',
    sparkColor: '#f97316',
  },
  {
    key: 'totalSwipes',
    label: 'Swipes',
    icon: Zap,
    color: 'bg-pink-500/20 text-pink-400',
    sparkColor: '#ec4899',
  },
  {
    key: 'totalMatches',
    label: 'Matches',
    icon: Trophy,
    color: 'bg-amber-500/20 text-amber-400',
    sparkColor: '#f59e0b',
  },
] as const;

const ACTIVITY_KEY_MAP: Record<string, keyof NonNullable<DailyActivityData>['days'][number]> = {
  totalSwipes: 'swipes',
  totalMatches: 'matches',
  totalRooms: 'newRooms',
  totalUsers: 'newUsers',
  totalGuests: 'newGuests',
};

export function KPICards({ stats, activity }: KPICardsProps) {
  const sparkData = useMemo(() => {
    if (!activity?.days) return {};
    const result: Record<string, number[]> = {};
    const days = activity.days.slice(-7);
    for (const [statKey, actKey] of Object.entries(ACTIVITY_KEY_MAP)) {
      result[statKey] = days.map((d) => d[actKey] as number);
    }
    return result;
  }, [activity]);

  const trends = useMemo(() => {
    if (!activity?.days || activity.days.length < 14) return {};
    const days = activity.days;
    const mid = Math.floor(days.length / 2);
    const result: Record<string, { current: number; previous: number }> = {};
    for (const [statKey, actKey] of Object.entries(ACTIVITY_KEY_MAP)) {
      const recent = days.slice(mid).reduce((s, d) => s + (d[actKey] as number), 0);
      const older = days.slice(0, mid).reduce((s, d) => s + (d[actKey] as number), 0);
      result[statKey] = { current: recent, previous: older };
    }
    return result;
  }, [activity]);

  return (
    <motion.div
      variants={fadeInUp}
      className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-3"
    >
      {KPI_CONFIG.map((cfg) => {
        const value = stats[cfg.key];
        const spark = sparkData[cfg.key];
        const trend = trends[cfg.key];

        return (
          <div
            key={cfg.label}
            className="bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-2xl p-4 group hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className={`w-8 h-8 rounded-lg ${cfg.color} flex items-center justify-center`}>
                <cfg.icon className="w-4 h-4" />
              </div>
              {spark && <Sparkline data={spark} color={cfg.sparkColor} />}
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </div>
              {trend && <TrendBadge current={trend.current} previous={trend.previous} />}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{cfg.label}</div>
          </div>
        );
      })}
    </motion.div>
  );
}
