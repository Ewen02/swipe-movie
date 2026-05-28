'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Film } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { startTrial, trialApiFetch } from '@/lib/trial';
import { getSession } from '@/lib/auth-client';
import { joinRoom } from '@/lib/api/rooms';

export default function TrialJoinPage() {
  const t = useTranslations('trial');
  const tJoin = useTranslations('trial.join');
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'fr';
  const code = params?.code as string;

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;

    async function joinAsLoggedUser() {
      // Existing account: join the room directly, no ghost user creation.
      await joinRoom({ code });
      router.replace(`/${locale}/rooms/${code}`);
    }

    async function joinAsGuest() {
      await startTrial();
      const joinRes = await trialApiFetch('/rooms/join', {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      if (!joinRes.ok) {
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
        setError(tJoin('error'));
      }
    }

    run();
  }, [code, locale, router, tJoin]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center max-w-sm mx-4">
          <Film className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-foreground font-medium mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary hover:underline text-sm"
          >
            {tJoin('retry')}
          </button>
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
