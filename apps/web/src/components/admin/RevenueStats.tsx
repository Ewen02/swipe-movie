import { DollarSign, TrendingDown, ArrowRightLeft, Clock } from 'lucide-react';
import { Section } from './Section';
import type { RevenueStats } from '@/lib/api/admin';

interface RevenueStatsProps {
  revenue: RevenueStats | undefined;
  isLoading: boolean;
}

function StatTile({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'default',
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: typeof DollarSign;
  tone?: 'default' | 'warn' | 'good';
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

export function RevenueStatsPanel({ revenue, isLoading }: RevenueStatsProps) {
  return (
    <Section title="Revenu / Subscriptions" loading={isLoading}>
      {revenue && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatTile
              icon={DollarSign}
              label="Subs payantes actives"
              value={revenue.activePaying}
              hint="hors trial / free"
            />
            <StatTile
              icon={ArrowRightLeft}
              label="Trial -> Paid (30j)"
              value={`${revenue.trialToPaidRate}%`}
              hint={`${revenue.trialConverted30d} / ${revenue.trialEnded30d}`}
              tone={revenue.trialToPaidRate >= 30 ? 'good' : 'default'}
            />
            <StatTile
              icon={TrendingDown}
              label="Churn 30j"
              value={`${revenue.churnRate30d}%`}
              hint={`${revenue.cancelled30d} annulations`}
              tone={revenue.churnRate30d > 10 ? 'warn' : 'default'}
            />
            <StatTile
              icon={Clock}
              label="Tenure moyen"
              value={`${revenue.avgTenureDays}j`}
              hint="subs actives payantes"
            />
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-2">Distribution par plan</div>
            {Object.keys(revenue.planCounts).length === 0 ? (
              <div className="text-xs text-muted-foreground italic">Pas de subscription active</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-xs text-muted-foreground">
                    <th className="text-left py-1.5">Plan</th>
                    <th className="text-right py-1.5">Active</th>
                    <th className="text-right py-1.5">Trialing</th>
                    <th className="text-right py-1.5">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(revenue.planCounts).map(([plan, c]) => (
                    <tr key={plan} className="border-b border-border/30">
                      <td className="py-1.5 font-mono text-xs uppercase">{plan}</td>
                      <td className="text-right">{c.active}</td>
                      <td className="text-right text-amber-400">{c.trialing}</td>
                      <td className="text-right font-semibold">{c.active + c.trialing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/30">
            Churn = annulations / (actives + annulees) sur la fenêtre. Tenure = age moyen des subs
            actives. Pas de MRR exact (prix gérés dans packages/subscription, pas en DB).
          </div>
        </div>
      )}
    </Section>
  );
}
