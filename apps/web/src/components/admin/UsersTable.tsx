import { ChevronLeft, ChevronRight, Download, Ghost, Shield, Sparkles } from 'lucide-react';
import { Button } from '@swipe-movie/ui';
import { Section } from './Section';
import { getExportUrl } from '@/lib/api/admin';
import type { AdminUsersFilter, AdminUsersResponse } from '@/lib/api/admin';

interface UsersTableProps {
  users: AdminUsersResponse | undefined;
  isLoading: boolean;
  page: number;
  filter: AdminUsersFilter;
  onPageChange: (page: number) => void;
  onFilterChange: (filter: AdminUsersFilter) => void;
}

const FILTER_OPTIONS: { label: string; value: AdminUsersFilter }[] = [
  { label: 'Users', value: 'users' },
  { label: 'Guests', value: 'guests' },
  { label: 'Tous', value: 'all' },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });
}

function formatRelative(dateStr: string | null) {
  if (!dateStr) return 'Jamais';
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "A l'instant";
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}j`;
}

export function UsersTable({
  users,
  isLoading,
  page,
  filter,
  onPageChange,
  onFilterChange,
}: UsersTableProps) {
  return (
    <Section
      title={`Utilisateurs ${users ? `(${users.total})` : ''}`}
      loading={isLoading}
      action={
        <div className="flex items-center gap-2">
          <div className="flex bg-muted/30 rounded-lg p-0.5">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onFilterChange(opt.value)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  filter === opt.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {users && users.totalPages > 1 && (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs text-muted-foreground px-1">
                {page}/{users.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= users.totalPages}
                onClick={() => onPageChange(page + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const url = getExportUrl('users', { filter });
              window.open(url, '_blank');
            }}
            title="Exporter CSV"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      }
    >
      {users ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-3 py-2 text-left text-muted-foreground font-medium">Nom</th>
                <th className="px-3 py-2 text-left text-muted-foreground font-medium">Email</th>
                <th className="px-3 py-2 text-center text-muted-foreground font-medium">Type</th>
                <th className="px-3 py-2 text-center text-muted-foreground font-medium">
                  Inscription
                </th>
                <th className="px-3 py-2 text-center text-muted-foreground font-medium">Swipes</th>
                <th className="px-3 py-2 text-center text-muted-foreground font-medium">Rooms</th>
                <th className="px-3 py-2 text-center text-muted-foreground font-medium">
                  Dernier actif
                </th>
              </tr>
            </thead>
            <tbody>
              {users.data.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      {user.name || '\u2014'}
                      {user.roles.includes('admin') && <Shield className="w-3 h-3 text-primary" />}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{user.email}</td>
                  <td className="px-3 py-2 text-center">
                    {user.isGuest ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-300 text-[10px] font-medium">
                        <Ghost className="w-3 h-3" /> Guest
                      </span>
                    ) : user.convertedFromGuestAt ? (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-medium"
                        title={`Converti le ${formatDate(user.convertedFromGuestAt)}`}
                      >
                        <Sparkles className="w-3 h-3" /> Converti
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-medium">
                        User
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center">{formatDate(user.createdAt)}</td>
                  <td className="px-3 py-2 text-center">{user.swipesCount}</td>
                  <td className="px-3 py-2 text-center">{user.roomsCount}</td>
                  <td className="px-3 py-2 text-center text-muted-foreground">
                    {formatRelative(user.lastActive)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </Section>
  );
}
