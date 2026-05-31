'use client';

import { Button } from '@swipe-movie/ui';
import { Bell, BellOff } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

/**
 * Self-contained push-notification opt-in. Drop it anywhere in a client page
 * (e.g. the settings page). Renders nothing on browsers without push support,
 * and a clear blocked-state message when the user denied permission.
 *
 * Intentionally dependency-light (no Card wrapper) so it composes inside an
 * existing settings layout.
 */
export function NotificationSettings() {
  const { status, busy, subscribe, unsubscribe } = usePushNotifications();

  const handleEnable = () => {
    void subscribe();
  };
  const handleDisable = () => {
    void unsubscribe();
  };

  if (status === 'unsupported') return null;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        {status === 'subscribed' ? (
          <Bell className="mt-0.5 h-5 w-5 text-primary" aria-hidden />
        ) : (
          <BellOff className="mt-0.5 h-5 w-5 text-muted-foreground" aria-hidden />
        )}
        <div>
          <p className="font-medium">Notifications push</p>
          <p className="text-sm text-muted-foreground">
            {status === 'subscribed'
              ? 'Vous serez prévenu des nouveaux matchs et invitations, même hors de l’app.'
              : status === 'denied'
                ? 'Notifications bloquées. Autorisez-les dans les réglages de votre navigateur.'
                : 'Soyez prévenu des nouveaux matchs et invitations, même hors de l’app.'}
          </p>
        </div>
      </div>

      {status === 'subscribed' ? (
        <Button variant="outline" size="sm" disabled={busy} onClick={handleDisable}>
          Désactiver
        </Button>
      ) : status === 'denied' ? null : (
        <Button size="sm" disabled={busy} onClick={handleEnable}>
          Activer
        </Button>
      )}
    </div>
  );
}
