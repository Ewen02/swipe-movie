'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Film, Sparkles, Users, Heart } from 'lucide-react';
import { useSWRConfig } from 'swr';
import { captureEvent } from '@/components/providers/PostHogProvider';
import { Button } from '@swipe-movie/ui';
import { useTranslations } from 'next-intl';
import { isTrialActive, getTrialData, startTrial, clearTrialData } from '@/lib/trial';
import { POST } from '@/lib/api';
import { USER_PREFERENCES_KEY } from '@/hooks/useUserPreferences';
import { ROOMS_KEY } from '@/hooks/useRooms';

const GENRE_OPTIONS = [
  { id: 28, emoji: '💥', labelKey: 'action' },
  { id: 35, emoji: '😂', labelKey: 'comedy' },
  { id: 27, emoji: '👻', labelKey: 'horror' },
  { id: 10749, emoji: '💕', labelKey: 'romance' },
  { id: 878, emoji: '🚀', labelKey: 'scifi' },
  { id: 18, emoji: '🎭', labelKey: 'drama' },
  { id: 16, emoji: '✨', labelKey: 'animation' },
  { id: 53, emoji: '🔍', labelKey: 'thriller' },
];

function TrialPageContent() {
  const t = useTranslations('trial');
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params?.locale as string) || 'fr';

  const [isCreating, setIsCreating] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [migrationState, setMigrationState] = useState<'idle' | 'migrating' | 'error'>('idle');
  const [migrationError, setMigrationError] = useState<string | null>(null);
  const { mutate: mutateSWR } = useSWRConfig();

  const handleStart = async (genreId?: number) => {
    setIsCreating(true);
    setSelectedGenre(genreId ?? null);

    try {
      // Check for existing trial session
      if (isTrialActive()) {
        const existing = getTrialData();
        if (existing) {
          router.push(`/${locale}/rooms/${existing.roomCode}`);
          return;
        }
      }

      const data = await startTrial({
        genreId,
        type: 'movie',
      });

      captureEvent('trial_started', { genreId, roomCode: data.roomCode });
      router.push(`/${locale}/rooms/${data.roomCode}`);
    } catch (err) {
      console.error('[TrialPage] Failed:', err);
      setIsCreating(false);
      setSelectedGenre(null);
    }
  };

  // Handle post-OAuth migration: ?migrate=true means user just signed up
  useEffect(() => {
    const shouldMigrate = searchParams?.get('migrate') === 'true';
    if (!shouldMigrate) return;

    const trialInfo = getTrialData();
    if (!trialInfo) {
      router.replace(`/${locale}/rooms`);
      return;
    }

    async function migrate() {
      setMigrationState('migrating');
      setMigrationError(null);
      const roomCode = trialInfo!.roomCode;
      const guestId = trialInfo!.guestId;
      const trialToken = trialInfo!.token;
      try {
        // Send the signed guest token so the backend can derive guestId from
        // the token itself (proof of ownership) instead of trusting the body.
        const res = await POST('/trial/migrate', {
          headers: { 'X-Trial-Token': trialToken },
          body: JSON.stringify({ guestId }),
        });

        // If the backend treated the call as already-migrated (404 guest), we
        // can treat that as success too — the rooms are already on the user.
        if (!res.ok && res.status !== 404) {
          const body = await res.text().catch(() => '');
          throw new Error(`Migration failed (${res.status}): ${body || res.statusText}`);
        }

        captureEvent('trial_converted', { guestId, roomCode });

        // Invalidate SWR caches that depend on the user identity:
        // - preferences (controls OnboardingCheck redirect)
        // - rooms list (so the trial room appears immediately)
        await Promise.all([mutateSWR(USER_PREFERENCES_KEY), mutateSWR(ROOMS_KEY)]);

        // Only clear trial data on confirmed success.
        clearTrialData();
        try {
          localStorage.removeItem(`trial-swipe-count-${roomCode}`);
        } catch {
          /* ignore */
        }

        router.replace(`/${locale}/rooms/${roomCode}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('[TrialPage] Migration failed:', err);
        captureEvent('trial_migration_failed', { guestId, roomCode, error: message });
        setMigrationState('error');
        setMigrationError(message);
        // Do NOT clear trial data and do NOT redirect — keep the user on this
        // page with a visible error and a retry path. The trial cookie/data
        // stays so the next retry has the guestId available.
      }
    }

    migrate();
  }, [searchParams, locale, router, mutateSWR]);

  // Migration in progress: prevents the user from briefly hitting the room
  // page with the (now-mismatched) trial auth before the migration finishes.
  if (migrationState === 'migrating') {
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
                setMigrationState('idle');
                setMigrationError(null);
                router.replace(`/${locale}/try?migrate=true`);
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

  // Show loading screen while creating room
  if (isCreating) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Film className="w-14 h-14 mx-auto animate-pulse text-primary" />
          <p className="text-lg font-medium text-foreground">{t('creating')}</p>
          <p className="text-sm text-muted-foreground">{t('creatingSubtitle')}</p>
        </motion.div>
      </div>
    );
  }

  // If ?genre=28 is in URL, skip genre selection and start directly
  const genreParam = searchParams?.get('genre');
  if (genreParam) {
    const genreId = parseInt(genreParam, 10);
    if (!isNaN(genreId)) {
      handleStart(genreId);
      return (
        <div className="flex h-screen items-center justify-center bg-background">
          <Film className="w-12 h-12 animate-pulse text-primary" />
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        className="max-w-lg w-full text-center space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="space-y-4">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4" />
            {t('badge')}
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h1>

          <p className="text-muted-foreground text-base max-w-md mx-auto">{t('subtitle')}</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Film className="w-4 h-4 text-primary" />
            <span>{t('step1')}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-primary" />
            <span>{t('step2')}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-primary" />
            <span>{t('step3')}</span>
          </div>
        </div>

        {/* Genre selection */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-foreground">{t('pickGenre')}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {GENRE_OPTIONS.map((genre) => (
              <motion.button
                key={genre.id}
                onClick={() => handleStart(genre.id)}
                disabled={isCreating}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border/60 bg-card/40 hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50 disabled:cursor-wait"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="text-2xl">
                  {isCreating && selectedGenre === genre.id ? (
                    <Film className="w-6 h-6 animate-spin text-primary" />
                  ) : (
                    genre.emoji
                  )}
                </span>
                <span className="text-xs font-medium">{t(`genres.${genre.labelKey}`)}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* All genres button */}
        <Button
          variant="outline"
          onClick={() => handleStart(0)}
          disabled={isCreating}
          className="rounded-full px-6"
        >
          {isCreating && selectedGenre === 0 ? (
            <Film className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          {t('allGenres')}
        </Button>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/60">
          <span>{t('trustFree')}</span>
          <span>·</span>
          <span>{t('trustNoAccount')}</span>
          <span>·</span>
          <span>{t('trust30s')}</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function TrialPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <Film className="w-12 h-12 animate-pulse text-primary" />
        </div>
      }
    >
      <TrialPageContent />
    </Suspense>
  );
}
