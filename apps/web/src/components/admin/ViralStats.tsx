import { Home, RotateCw, Share2, UserPlus, Ghost, Crown } from 'lucide-react';
import { Section } from './Section';
import type { ViralStats } from '@/lib/api/admin';

interface ViralStatsProps {
  viral: ViralStats | undefined;
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
  icon?: typeof Home;
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

export function ViralStatsPanel({ viral, isLoading }: ViralStatsProps) {
  return (
    <Section title="Viralité / Rooms" loading={isLoading}>
      {viral && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatTile
              icon={UserPlus}
              label="Taille moyenne room"
              value={viral.avgRoomSize}
              hint="membres / room"
            />
            <StatTile
              icon={Share2}
              label="Rooms multi-user"
              value={`${viral.multiUserRate}%`}
              hint=">= 2 membres"
            />
            <StatTile
              icon={Home}
              label="Rooms orphelines"
              value={viral.orphanRooms}
              hint="code partagé jamais rejoint"
            />
            <StatTile
              icon={RotateCw}
              label="Rooms recurring"
              value={viral.recurringRooms}
              hint={`${viral.recurringRate}% des rooms`}
            />
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-2">Distribution taille de rooms</div>
            <div className="grid grid-cols-4 gap-2 text-[11px]">
              {[
                { label: 'Solo (1)', val: viral.sizeDistribution.size1, color: 'bg-red-500/40' },
                { label: '2', val: viral.sizeDistribution.size2, color: 'bg-amber-500/40' },
                { label: '3-4', val: viral.sizeDistribution.size3_4, color: 'bg-emerald-500/40' },
                { label: '5+', val: viral.sizeDistribution.size5_plus, color: 'bg-blue-500/40' },
              ].map((b) => (
                <div key={b.label} className={`rounded-lg p-2 ${b.color}`}>
                  <div className="text-muted-foreground">{b.label}</div>
                  <div className="text-lg font-bold">{b.val}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Crown className="w-3.5 h-3.5" /> Top 10 inviteurs (par membres attirés)
            </div>
            {viral.topInviters.length === 0 ? (
              <div className="text-xs text-muted-foreground italic">
                Pas encore d&apos;inviteur actif
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-xs text-muted-foreground">
                    <th className="text-left py-1.5">User</th>
                    <th className="text-right py-1.5">Rooms</th>
                    <th className="text-right py-1.5">Membres totaux</th>
                  </tr>
                </thead>
                <tbody>
                  {viral.topInviters.map((u) => (
                    <tr key={u.userId} className="border-b border-border/30 hover:bg-muted/20">
                      <td className="py-1.5">
                        <div className="flex items-center gap-2">
                          {u.isGuest && <Ghost className="w-3 h-3 text-slate-400" />}
                          <span className="truncate">{u.name || u.email}</span>
                        </div>
                      </td>
                      <td className="text-right">{u.roomsCreated}</td>
                      <td className="text-right font-semibold">{u.totalMembersAttracted}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </Section>
  );
}
