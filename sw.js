// Cache minimale: l'app funziona anche senza connessione.
// Se modifichi index.html, aumenta la versione di CACHE per forzare l'aggiornamento.
const CACHE = 'agenda-v13';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon.svg'];

// Si attiva subito, senza aspettare che si chiudano le schede vecchie.
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copia = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copia));
      return res;
    })).catch(() => caches.match('./index.html'))
  );
});
