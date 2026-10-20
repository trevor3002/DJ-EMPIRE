// DJ Empire service worker: serve the app shell and hashed build assets from cache
// first so the iPhone Home Screen app can render immediately on repeat launches.
const CACHE_NAME = 'dj-empire-v3';
const APP_BASE = new URL('./', self.registration.scope);
const APP_PATH = APP_BASE.pathname;
const INDEX_URL = new URL('index.html', APP_BASE).href;
const CORE_ASSETS = [
  APP_BASE.href,
  INDEX_URL,
  new URL('manifest.json', APP_BASE).href,
  new URL('icon.svg', APP_BASE).href
];

async function precacheBuiltAssets(cache) {
  try {
    const response = await fetch(INDEX_URL, { cache: 'no-cache' });
    if (!response.ok) return;
    const html = await response.text();
    const assets = new Set();
    const attributePattern = /(?:src|href)=["']([^"']+)["']/g;
    let match;
    while ((match = attributePattern.exec(html)) !== null) {
      try {
        const assetUrl = new URL(match[1], APP_BASE);
        if (
          assetUrl.origin === self.location.origin &&
          assetUrl.pathname.startsWith(APP_PATH) &&
          assetUrl.pathname.includes('/assets/')
        ) {
          assets.add(assetUrl.href);
        }
      } catch (_) {
        // Ignore non-URL attributes.
      }
    }
    if (assets.size) {
      await Promise.all([...assets].map(async (url) => {
        try {
          const assetResponse = await fetch(url, { cache: 'no-cache' });
          if (assetResponse.ok) await cache.put(url, assetResponse);
        } catch (_) {
          // Keep installing even if one optional asset cannot be downloaded.
        }
      }));
    }
  } catch (_) {
    // Core app shell is still available if asset pre-caching fails.
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        await cache.addAll(CORE_ASSETS);
        await precacheBuiltAssets(cache);
      })
      .catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('dj-empire-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;
  if (!requestUrl.pathname.startsWith(APP_PATH)) return;

  const isNavigation = event.request.mode === 'navigate';
  const isBuiltAsset = requestUrl.pathname.includes('/assets/');

  if (isNavigation || isBuiltAsset) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(event.request, { ignoreSearch: isBuiltAsset });
      if (cached) {
        // Return cached content immediately; refresh it in the background.
        event.waitUntil((async () => {
          try {
            const fresh = await fetch(event.request);
            if (fresh.ok) await cache.put(event.request, fresh.clone());
          } catch (_) {
            // Offline or temporarily unavailable: keep using the cached version.
          }
        })());
        return cached;
      }

      try {
        const fresh = await fetch(event.request);
        if (fresh.ok) await cache.put(event.request, fresh.clone());
        return fresh;
      } catch (_) {
        if (isNavigation) {
          return (await cache.match(INDEX_URL)) || Response.error();
        }
        return (await cache.match(event.request)) || Response.error();
      }
    })());
    return;
  }

  // Network-first for other same-origin files, with cache fallback.
  event.respondWith(
    fetch(event.request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      }
      return response;
    }).catch(async () => (await caches.match(event.request)) || Response.error())
  );
});
