import { Ghost, AlertTriangle, ArrowRightLeft, Zap } from 'lucide-react';
import { Section } from './Section';
import type { TrialStats } from '@/lib/api/admin';

interface GuestStatsProps {
  trialStats: TrialStats | undefined;
  isLoading: boolean;
}

function Stat({
  label,
  value,
  hint,
  tone = 'default',
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: 'default' | 'warn' | 'good';
  icon?: typeof Ghost;
}) {
  const toneColor =
    tone === 'warn' ? 'text-amber-400' : tone === 'good' ? 'text-emerald-400' : 'text-foreground';
  return (
    <div className="bg-muted/20 rounded-xl p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        <span>{label}</span>
      </div>
      <div className={`text-2xl font-bold ${toneColor}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      {hint && <div className="text-[11px] text-muted-foreground mt-0.5">{hint}</div>}
    </div>
  );
}

export function GuestStats({ trialStats, isLoading }: GuestStatsProps) {
  return (
    <Section title="Trial / Guests" loading={isLoading}>
      {trialStats && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat
              icon={Ghost}
              label="Guests actifs (24h)"
              value={trialStats.activeGhosts}
              hint={`${trialStats.totalGhosts} total en base`}
            />
            <Stat
              icon={AlertTriangle}
              label="Engagés a risque"
              value={trialStats.engagedActiveGhosts}
              hint=">= 5 swipes, pas encore convertis"
              tone={trialStats.engagedActiveGhosts > 0 ? 'warn' : 'default'}
            />
            <Stat
              icon={ArrowRightLeft}
              label="Conversions 30j"
              value={trialStats.conversions30d}
              hint={`${trialStats.conversionRate30d}% de taux`}
              tone={trialStats.conversionRate30d >= 20 ? 'good' : 'default'}
            />
            <Stat
              icon={Zap}
              label="Total conversions"
              value={trialStats.totalConversions}
              hint={`Avg ${Math.round(trialStats.avgGuestSwipesAtConversion)} swipes`}
            />
          </div>

          <div className="pt-3 border-t border-border/50 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <div className="text-muted-foreground">Swipes guests</div>
              <div className="text-sm font-semibold">{trialStats.ghostSwipes.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Matches guests</div>
              <div className="text-sm font-semibold">
                {trialStats.ghostMatches.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Guests expirés (a nettoyer)</div>
              <div className="text-sm font-semibold">
                {trialStats.totalGhostsExpired.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Swipes transférés</div>
              <div className="text-sm font-semibold">
                {trialStats.totalGuestSwipesConverted.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
