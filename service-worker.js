const CACHE_NAME = 'fabridata-v1';
const ARQUIVOS = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARQUIVOS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((resp) => {
        return caches.open(CACHE_NAME).then((cache) => {
          if (event.request.method === 'GET' && resp.status === 200){
            cache.put(event.request, resp.clone());
          }
          return resp;
        });
      }).catch(() => cached);
    })
  );
});