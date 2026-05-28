import { Section } from './Section';
import type { ConversionStats } from '@/lib/api/admin';

interface ConversionFunnelProps {
  conversions: ConversionStats | undefined;
  isLoading: boolean;
}

function FunnelBar({
  label,
  count,
  rate,
  total,
}: {
  label: string;
  count: number;
  rate: number;
  total: number;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {count} <span className="text-muted-foreground">({rate}%)</span>
        </span>
      </div>
      <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-500"
          style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
        />
      </div>
    </div>
  );
}

export function ConversionFunnel({ conversions, isLoading }: ConversionFunnelProps) {
  return (
    <Section title="Funnel de Conversion (users authentifiés)" loading={isLoading}>
      {conversions && (
        <div className="space-y-3">
          <FunnelBar
            label="Inscrits"
            count={conversions.totalUsers}
            rate={100}
            total={conversions.totalUsers}
          />
          <FunnelBar
            label="Onboarding complete"
            count={conversions.onboarded.count}
            rate={conversions.onboarded.rate}
            total={conversions.totalUsers}
          />
          <FunnelBar
            label="A rejoint une room"
            count={conversions.withRoom.count}
            rate={conversions.withRoom.rate}
            total={conversions.totalUsers}
          />
          <FunnelBar
            label="A swipe"
            count={conversions.withSwipe.count}
            rate={conversions.withSwipe.rate}
            total={conversions.totalUsers}
          />
          <div className="pt-2 border-t border-border/50 flex justify-between text-sm">
            <span className="text-muted-foreground">Total matches</span>
            <span className="font-bold text-amber-400">{conversions.totalMatches}</span>
          </div>
          <p className="text-[11px] text-muted-foreground pt-1">
            Les guests trial sont exclus du dénominateur. Voir l&apos;onglet Guests pour le funnel
            trial.
          </p>
        </div>
      )}
    </Section>
  );
}
