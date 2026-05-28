import { useMemo } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@swipe-movie/ui';
import { Section } from './Section';
import { getExportUrl } from '@/lib/api/admin';
import type { DailyActivityData, DailyActivityDay } from '@/lib/api/admin';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface ActivityChartProps {
  activity: DailyActivityData | undefined;
  isLoading: boolean;
  activityDays: number;
  onChangeDays: (days: number) => void;
}

const PERIOD_OPTIONS = [
  { label: '7j', value: 7 },
  { label: '30j', value: 30 },
  { label: '90j', value: 90 },
];

const METRICS = [
  { key: 'swipes', label: 'Swipes', color: '#3b82f6' },
  { key: 'matches', label: 'Matches', color: '#f59e0b' },
  { key: 'newUsers', label: 'Nouveaux users', color: '#22c55e' },
  { key: 'newGuests', label: 'Nouveaux guests', color: '#94a3b8' },
  { key: 'newConversions', label: 'Conversions G->U', color: '#10b981' },
  { key: 'newRooms', label: 'Nouvelles rooms', color: '#a855f7' },
] as const;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload) return null;
  return (
    <div className="bg-background/95 backdrop-blur border border-border rounded-lg p-3 shadow-lg text-xs">
      <p className="font-medium mb-1.5">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 py-0.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

function MetricSummary({
  days,
  metric,
}: {
  days: DailyActivityDay[];
  metric: (typeof METRICS)[number];
}) {
  const total = days.reduce((s, d) => s + (d[metric.key] as number), 0);
  const avg = days.length > 0 ? Math.round(total / days.length) : 0;
  const values = days.map((d) => d[metric.key] as number);
  const max = Math.max(...values, 0);
  const lastDay = values[values.length - 1] ?? 0;
  const prevDay = values[values.length - 2] ?? 0;
  const trend = prevDay > 0 ? Math.round(((lastDay - prevDay) / prevDay) * 100) : 0;

  return (
    <div className="bg-background/60 border border-border rounded-xl p-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: metric.color }} />
        <span className="text-xs text-muted-foreground">{metric.label}</span>
      </div>
      <div className="text-xl font-bold">{total.toLocaleString()}</div>
      <div className="flex gap-3 mt-1 text-[10px] text-muted-foreground">
        <span>moy. {avg}/j</span>
        <span>max {max}</span>
        {trend !== 0 && (
          <span className={trend > 0 ? 'text-green-400' : 'text-red-400'}>
            {trend > 0 ? '+' : ''}
            {trend}%
          </span>
        )}
      </div>
    </div>
  );
}

export function ActivityChart({
  activity,
  isLoading,
  activityDays,
  onChangeDays,
}: ActivityChartProps) {
  const chartData = useMemo(() => {
    if (!activity?.days) return [];
    return activity.days.map((d) => ({
      ...d,
      date: formatDate(d.date),
    }));
  }, [activity]);

  return (
    <Section
      title="Activite"
      loading={isLoading}
      action={
        <div className="flex items-center gap-2">
          <div className="flex bg-muted/30 rounded-lg p-0.5">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChangeDays(opt.value)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  activityDays === opt.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const url = getExportUrl('activity', { days: activityDays });
              window.open(url, '_blank');
            }}
            title="Exporter CSV"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      }
    >
      {activity && activity.days.length > 0 ? (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {METRICS.map((metric) => (
              <MetricSummary key={metric.key} days={activity.days} metric={metric} />
            ))}
          </div>

          {/* Swipes chart (area) - separate because of scale difference */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              Swipes
            </h4>
            <ResponsiveContainer width="100%" height={180}>
              <RechartsAreaChart
                data={chartData}
                margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="swipesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#888' }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 10, fill: '#888' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="swipes"
                  name="Swipes"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#swipesGradient)"
                />
              </RechartsAreaChart>
            </ResponsiveContainer>
          </div>

          {/* Matches + Users + Rooms (bar chart - comparable scale) */}
          <div>
            <h4 className="text-sm font-medium mb-2">Matches, Users & Rooms</h4>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#888' }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 10, fill: '#888' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="matches" name="Matches" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                <Bar
                  dataKey="newUsers"
                  name="Nouveaux users"
                  fill="#22c55e"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="newRooms"
                  name="Nouvelles rooms"
                  fill="#a855f7"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Trial funnel (guests vs conversions) */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-400" />
              Trial funnel
            </h4>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#888' }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 10, fill: '#888' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="newGuests"
                  name="Nouveaux guests"
                  fill="#94a3b8"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="newConversions"
                  name="Conversions G->U"
                  fill="#10b981"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : null}
    </Section>
  );
}
