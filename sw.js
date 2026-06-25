const CACHE_NAME = 'vancash-pro-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/dexie/4.2.0/dexie.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(e.request).then(hit => {
        const net = fetch(e.request).then(res => {
          if (e.request.method === 'GET' && res.status === 200) {
            cache.put(e.request, res.clone());
          }
          return res;
        }).catch(() => hit);
        return hit || net;
      });
    })
  );
});