// DJ Empire service worker. Cache only built production URLs, never TSX source files.
const CACHE_NAME = 'dj-empire-v2';
const APP_BASE = new URL('./', self.registration.scope);
const APP_PATH = APP_BASE.pathname;
const CORE_ASSETS = [
  new URL('./', APP_BASE).href,
  new URL('index.html', APP_BASE).href,
  new URL('manifest.json', APP_BASE).href,
  new URL('icon.svg', APP_BASE).href
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key.startsWith('dj-empire-') && key !== CACHE_NAME)
        .map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request).then((response) => {
      if (response.ok && requestUrl.pathname.startsWith(APP_PATH)) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      }
      return response;
    }).catch(async () => {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      if (event.request.mode === 'navigate') {
        return (await caches.match(new URL('index.html', APP_BASE).href)) || Response.error();
      }
      return Response.error();
    })
  );
});
