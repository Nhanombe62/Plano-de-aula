const CACHE_NAME = 'plano-aula-v2.3.1';
const DYNAMIC_CACHE = 'plano-aula-dynamic-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/sobre.html',
  '/termos.html',
  '/planovip.html',
  '/planogratis.html',
  '/ingles.html',
  '/abano.html',
  '/plano_quinzenal.html',
  '/.well-known/assetlinks.json',
  '/icon-192x192.png',
  '/manifest.json'
];

// ==================== INSTALAÇÃO ====================
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache instalado:', CACHE_NAME);
      return cache.addAll(urlsToCache);
    })
  );
});

// ==================== FETCH ====================
self.addEventListener('fetch', event => {
  if (event.request.url.startsWith('chrome-extension://')) return;

  // Para navegação HTML
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Se offline, serve do cache ou index.html
          return caches.match(event.request)
            .then(res => res || caches.match('/index.html'));
        })
    );
    return;
  }

  // Outros recursos: cache-first
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      }).catch(() => cachedResponse);
      return cachedResponse || fetchPromise;
    })
  );
});

// ==================== ATIVAÇÃO ====================
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (![CACHE_NAME, DYNAMIC_CACHE].includes(cacheName)) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => clients.claim())
  );
});

// ==================== MENSAGENS ====================
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
  if (event.data === 'UPDATE_CACHE') self.registration.update();
});
