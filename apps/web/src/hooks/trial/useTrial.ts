'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSWRConfig } from 'swr';
import {
  clearTrialData,
  getTrialData,
  isTrialActive,
  startTrial,
  type TrialData,
} from '@/lib/trial';
import { POST } from '@/lib/api';
import { USER_PREFERENCES_KEY } from '@/hooks/useUserPreferences';
import { ROOMS_KEY } from '@/hooks/useRooms';
import { captureEvent } from '@/components/providers/PostHogProvider';

export type TrialMigrationState = 'idle' | 'migrating' | 'success' | 'error';

interface UseTrialOptions {
  /**
   * If true, the hook re-reads localStorage on window focus / storage events so
   * components that mount before a trial is created (or in another tab) still
   * observe the change. Off by default — most consumers read at mount.
   */
  reactive?: boolean;
}

interface UseTrialReturn {
  data: TrialData | null;
  isActive: boolean;
  start: typeof startTrial;
  clear: () => void;
  migrate: () => Promise<{ ok: boolean; alreadyMigrated: boolean; error?: string }>;
  migrationState: TrialMigrationState;
  migrationError: string | null;
}

/**
 * Centralises every interaction with the trial session: read/start/clear and
 * the post-OAuth migration. Lives here so /try, /try/migrate, /try/join and
 * any consumer that needs to know "is the current visitor a guest" share the
 * exact same code path — no chance of two callsites diverging on cookie/storage
 * cleanup or SWR invalidation.
 */
export function useTrial(options: UseTrialOptions = {}): UseTrialReturn {
  const { mutate: mutateSWR } = useSWRConfig();
  const [data, setData] = useState<TrialData | null>(() => getTrialData());
  const [migrationState, setMigrationState] = useState<TrialMigrationState>('idle');
  const [migrationError, setMigrationError] = useState<string | null>(null);

  // Sync state when another tab updates localStorage (or when reactive mode is
  // on and the user comes back from OAuth in the same tab).
  useEffect(() => {
    if (!options.reactive) return;
    const sync = () => setData(getTrialData());
    window.addEventListener('storage', sync);
    window.addEventListener('focus', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('focus', sync);
    };
  }, [options.reactive]);

  const start = useCallback<typeof startTrial>(async (opts) => {
    const result = await startTrial(opts);
    setData(result);
    return result;
  }, []);

  const clear = useCallback(() => {
    clearTrialData();
    setData(null);
  }, []);

  const migrate = useCallback(async () => {
    const trial = getTrialData();
    if (!trial) {
      return { ok: false, alreadyMigrated: false, error: 'no_trial_data' };
    }
    const { guestId, roomCode, token: trialToken } = trial;
    const startedAt = Date.now();

    setMigrationState('migrating');
    setMigrationError(null);
    captureEvent('trial_migration_attempted', { guestId, roomCode });

    try {
      const res = await POST('/trial/migrate', {
        headers: { 'X-Trial-Token': trialToken },
        body: JSON.stringify({ guestId }),
      });

      // 404 means the guest row is already gone — equivalent to "already
      // migrated" for our purposes. The backend now returns 200 with
      // alreadyMigrated:true for that case too, but the fallback keeps us
      // compatible with older deployments.
      if (!res.ok && res.status !== 404) {
        const body = await res.text().catch(() => '');
        throw new Error(`Migration failed (${res.status}): ${body || res.statusText}`);
      }

      const payload = await res.json().catch(() => ({}) as { alreadyMigrated?: boolean });
      const alreadyMigrated = Boolean(payload?.alreadyMigrated) || res.status === 404;

      captureEvent('trial_migration_succeeded', {
        guestId,
        roomCode,
        alreadyMigrated,
        durationMs: Date.now() - startedAt,
      });
      captureEvent('trial_converted', { guestId, roomCode });

      // Invalidate SWR caches that depend on the now-promoted identity.
      await Promise.all([mutateSWR(USER_PREFERENCES_KEY), mutateSWR(ROOMS_KEY)]);

      clear();
      try {
        localStorage.removeItem(`trial-swipe-count-${roomCode}`);
      } catch {
        /* ignore */
      }

      setMigrationState('success');
      return { ok: true, alreadyMigrated };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[useTrial] Migration failed:', err);
      captureEvent('trial_migration_failed', {
        guestId,
        roomCode,
        error: message,
        durationMs: Date.now() - startedAt,
      });
      setMigrationState('error');
      setMigrationError(message);
      // Intentionally NOT clearing trial data here so the user can retry.
      return { ok: false, alreadyMigrated: false, error: message };
    }
  }, [mutateSWR, clear]);

  return {
    data,
    isActive: data !== null && isTrialActive(),
    start,
    clear,
    migrate,
    migrationState,
    migrationError,
  };
}
