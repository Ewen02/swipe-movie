'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Film } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { startTrial, trialApiFetch } from '@/lib/trial';
import { getSession } from '@/lib/auth-client';
import { joinRoom } from '@/lib/api/rooms';
import { ApiError } from '@/lib/http/parseResponse';

// 410 GONE = the room was auto-expired before the invite link was opened. We
// surface this distinctly from a generic failure so a friend opening a stale
// link gets a clear message + a path forward (create their own room) instead of
// a dead-end "retry" that can never succeed.
type JoinFailure = 'expired' | 'generic';

export default function TrialJoinPage() {
  const t = useTranslations('trial');
  const tJoin = useTranslations('trial.join');
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'fr';
  const code = params?.code as string;

  const [failure, setFailure] = useState<JoinFailure | null>(null);

  useEffect(() => {
    if (!code) return;

    async function joinAsLoggedUser() {
      // Existing account: join the room directly, no ghost user creation.
      // room_joined is now emitted server-side; we pass `source` so it keeps
      // the acquisition-channel dimension only the client knows.
      await joinRoom({ code, source: 'invite_link' });
      router.replace(`/${locale}/rooms/${code}`);
    }

    async function joinAsGuest() {
      await startTrial();
      const joinRes = await trialApiFetch('/rooms/join', {
        method: 'POST',
        body: JSON.stringify({ code, source: 'invite_link_guest' }),
      });
      if (!joinRes.ok) {
        if (joinRes.status === 410) throw new ApiError('expired', 410);
        const body = await joinRes.json().catch(() => ({}));
        throw new Error(body?.message || 'join_failed');
      }
      router.replace(`/${locale}/rooms/${code}`);
    }

    async function run() {
      try {
        const session = await getSession();
        if (session?.data?.user?.email) {
          await joinAsLoggedUser();
        } else {
          await joinAsGuest();
        }
      } catch (err) {
        console.error('[TrialJoin] Error:', err);
        const isExpired = err instanceof ApiError && err.status === 410;
        setFailure(isExpired ? 'expired' : 'generic');
      }
    }

    run();
  }, [code, locale, router, tJoin]);

  if (failure) {
    const expired = failure === 'expired';
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center max-w-sm mx-4">
          <Film className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-foreground font-medium mb-2">
            {expired ? tJoin('expiredTitle') : tJoin('error')}
          </p>
          {expired && (
            <p className="text-sm text-muted-foreground mb-4">{tJoin('expiredSubtitle')}</p>
          )}
          {expired ? (
            <button
              onClick={() => router.push(`/${locale}/rooms`)}
              className="text-primary hover:underline text-sm"
            >
              {tJoin('createOwnRoom')}
            </button>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="text-primary hover:underline text-sm"
            >
              {tJoin('retry')}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="text-center">
        <Film className="w-12 h-12 mx-auto mb-4 animate-pulse text-primary" />
        <p className="text-muted-foreground">{t('loading')}</p>
      </div>
    </div>
  );
}
