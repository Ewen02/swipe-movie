// Self-destroying service worker.
//
// The PWA service worker was disabled (see next.config.ts) because its
// navigation cache re-fetched the whole app shell on every deploy and blew past
// the Vercel Hobby quota. Browsers that already registered the old worker keep
// running it until it updates — so this minimal replacement unregisters itself
// and deletes all caches, letting existing clients self-heal on their next load.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client) => client.navigate(client.url));
    })(),
  );
});
