'use client';

import { useCallback, useEffect, useState } from 'react';
import { GET, POST } from '@/lib/api';

type PushStatus =
  | 'unsupported' // browser lacks the APIs
  | 'default' // permission not yet asked
  | 'denied' // user blocked notifications
  | 'subscribed' // active push subscription
  | 'unsubscribed'; // permission granted but no active subscription

/**
 * Converts a base64url VAPID public key into the ArrayBuffer the Push API
 * accepts for `applicationServerKey`. A plain string is also valid per spec,
 * but the DOM lib's BufferSource typing is the most portable across browsers.
 */
function urlBase64ToArrayBuffer(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const buffer = new ArrayBuffer(raw.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) view[i] = raw.charCodeAt(i);
  return buffer;
}

function isSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/**
 * Manages the browser-side Web Push lifecycle: read current state, subscribe
 * (asks permission, registers with the push service, persists the subscription
 * server-side) and unsubscribe. Server endpoints: GET /push/public-key,
 * POST /push/subscribe, POST /push/unsubscribe.
 */
export function usePushNotifications() {
  const [status, setStatus] = useState<PushStatus>('default');
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    if (!isSupported()) {
      setStatus('unsupported');
      return;
    }
    if (Notification.permission === 'denied') {
      setStatus('denied');
      return;
    }
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    setStatus(sub ? 'subscribed' : 'unsubscribed');
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported()) return false;
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setStatus(permission === 'denied' ? 'denied' : 'unsubscribed');
        return false;
      }

      const res = await GET('/push/public-key');
      const { publicKey } = (await res.json()) as { publicKey: string | null };
      if (!publicKey) {
        // Push not configured on the server — nothing to subscribe to.
        setStatus('unsubscribed');
        return false;
      }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToArrayBuffer(publicKey),
      });

      const json = sub.toJSON();
      await POST('/push/subscribe', {
        body: JSON.stringify({
          endpoint: sub.endpoint,
          keys: { p256dh: json.keys?.p256dh, auth: json.keys?.auth },
        }),
      });
      setStatus('subscribed');
      return true;
    } catch {
      // Network/permission hiccup — re-derive the real state.
      await refresh();
      return false;
    } finally {
      setBusy(false);
    }
  }, [refresh]);

  const unsubscribe = useCallback(async (): Promise<void> => {
    if (!isSupported()) return;
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await POST('/push/unsubscribe', {
          body: JSON.stringify({ endpoint: sub.endpoint }),
        }).catch(() => undefined);
        await sub.unsubscribe();
      }
      setStatus('unsubscribed');
    } finally {
      setBusy(false);
    }
  }, []);

  return { status, busy, subscribe, unsubscribe, refresh };
}
