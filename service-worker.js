const CACHE_NAME = 'plano-aula-v2.3.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/sobre.html',
  '/.well-known/assetlinks.json',
  '/termos.html',
];

// Instalação
self.addEventListener('install', event => {
  self.skipWaiting(); // Ativa a nova versão instantaneamente
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache aberto');
      return cache.addAll(urlsToCache);
    })
  );
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  clients.claim(); // Faz o SW novo assumir imediatamente
});

// Ouve comando para ativar o SW imediatamente
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
