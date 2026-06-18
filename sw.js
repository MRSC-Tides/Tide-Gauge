const CACHE_NAME = 'matlab-app-v2'; // Incremented version to clear old cache
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install event - cache core app layout shell
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching app shell');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting()) // Forces the waiting service worker to become active
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Takes control of open pages immediately
  );
});

// Fetch event - Network-first strategy with robust cache fallback
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request).then((response) => {
        if (response) {
          return response;
        }
        // Fallback if the specific relative path asset is requested
        const url = new URL(e.request.url);
        return caches.match('.' + url.pathname);
      });
    })
  );
});
