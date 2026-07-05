const CACHE = 'nws2026-v5';

self.addEventListener('install', ev => {
  ev.waitUntil(caches.open(CACHE).then(c => c.add('./')));
  self.skipWaiting();
});

self.addEventListener('activate', ev => {
  ev.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', ev => {
  if (ev.request.mode === 'navigate') {
    // Network-first per HTML: garantisce sempre codice aggiornato
    ev.respondWith(fetch(ev.request).catch(() => caches.match('./')));
    return;
  }
  ev.respondWith(caches.match(ev.request).then(r => r || fetch(ev.request)));
});
