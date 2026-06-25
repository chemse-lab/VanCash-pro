const CACHE_NAME = 'vancash-pro-v2'; // تم رفع الإصدار لفرض التحديث
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/dexie/4.2.0/dexie.min.js'
];

self.addEventListener('install', e => {
  self.skipWaiting(); // فرض تثبيت التحديث فوراً
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', e => {
  // تفريغ الكاش القديم المتسبب في التعارض
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      return cachedResponse || fetch(e.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          if (e.request.method === 'GET') {
            cache.put(e.request, networkResponse.clone());
          }
          return networkResponse;
        });
      });
    })
  );
});
