'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Film } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@swipe-movie/ui';
import { useTrial } from '@/hooks/trial/useTrial';
import { getTrialData } from '@/lib/trial';

/**
 * Dedicated route for the post-OAuth trial-to-user migration. Split off /try
 * (which only handles genre pick + trial creation) so each route has one job
 * and the render tree doesn't juggle three exclusive states. Better Auth's
 * callbackURL points here after sign-in.
 */
function MigratePageContent() {
  const t = useTranslations('trial');
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'fr';
  const { migrate, migrationState, migrationError } = useTrial();
  const startedRef = useRef(false);
  const lastRoomCodeRef = useRef<string | null>(null);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const trial = getTrialData();
    if (!trial) {
      // Nothing to migrate (cookie cleared, expired session, direct hit).
      router.replace(`/${locale}/rooms`);
      return;
    }
    lastRoomCodeRef.current = trial.roomCode;

    void migrate().then((result) => {
      if (result.ok && lastRoomCodeRef.current) {
        router.replace(`/${locale}/rooms/${lastRoomCodeRef.current}`);
      }
    });
  }, [migrate, router, locale]);

  if (migrationState === 'error') {
    return (
      <div className="flex h-screen items-center justify-center bg-background px-6">
        <div className="text-center space-y-4 max-w-md">
          <p className="text-lg font-semibold text-foreground">{t('migrationErrorTitle')}</p>
          <p className="text-sm text-muted-foreground">{t('migrationErrorDescription')}</p>
          {migrationError && (
            <p className="text-xs text-muted-foreground/60 font-mono break-all">{migrationError}</p>
          )}
          <div className="flex gap-3 justify-center pt-2">
            <Button
              onClick={() => {
                startedRef.current = false;
                router.replace(`/${locale}/try/migrate`);
              }}
            >
              {t('migrationRetry')}
            </Button>
            <Button variant="outline" onClick={() => router.replace(`/${locale}/rooms`)}>
              {t('migrationGoToRooms')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default = migrating (or about to). Show a steady loader so the user never
  // catches a flash of the room before the auth swap completes.
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Film className="w-14 h-14 mx-auto animate-pulse text-primary" />
        <p className="text-lg font-medium text-foreground">{t('migrating')}</p>
        <p className="text-sm text-muted-foreground">{t('migratingSubtitle')}</p>
      </motion.div>
    </div>
  );
}

export default function MigratePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <Film className="w-12 h-12 animate-pulse text-primary" />
        </div>
      }
    >
      <MigratePageContent />
    </Suspense>
  );
}
