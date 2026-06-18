const CACHE_NAME = 'matlab-app-v1';
const ASSETS = [
  'index.html',
  'manifest.json'
];

// Install event - cache core app layout shell
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Fetch event - serve from network first, fall back to cache if offline
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
