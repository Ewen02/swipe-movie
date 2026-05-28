import { Cpu, Database, Server } from 'lucide-react';
import { Section } from './Section';
import type { PerformanceStats } from '@/lib/api/admin';

interface PerformanceStatsProps {
  performance: PerformanceStats | undefined;
  isLoading: boolean;
}

function fmtUptime(sec: number): string {
  if (sec < 60) return `${sec}s`;
  if (sec < 3600) return `${Math.round(sec / 60)}min`;
  if (sec < 86400) return `${Math.round(sec / 3600)}h`;
  return `${Math.round(sec / 86400)}j`;
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
  icon?: typeof Cpu;
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

export function PerformanceStatsPanel({ performance, isLoading }: PerformanceStatsProps) {
  return (
    <Section title="Performance / Runtime" loading={isLoading}>
      {performance && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatTile
              icon={Server}
              label="API uptime"
              value={fmtUptime(performance.process.uptimeSec)}
              hint={performance.process.nodeVersion}
            />
            <StatTile
              icon={Cpu}
              label="Heap utilise"
              value={`${performance.process.heapUsedMb} MB`}
            />
            <StatTile
              icon={Database}
              label="Cache TTL admin"
              value={`${performance.adminCacheTtlSec}s`}
              hint="freshness des metriques"
            />
            <StatTile
              icon={Database}
              label="Sessions actives"
              value={performance.tableSizes.sessions}
            />
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-2">Taille des tables (lignes)</div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
              {Object.entries(performance.tableSizes).map(([table, count]) => (
                <div key={table} className="bg-muted/20 rounded-lg p-2">
                  <div className="text-muted-foreground capitalize">{table}</div>
                  <div className="text-lg font-bold">{count.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
