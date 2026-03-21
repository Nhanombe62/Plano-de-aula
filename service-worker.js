const CACHE_NAME = 'plano-aula-v3.3.2';
const DYNAMIC_CACHE = 'plano-aula-dynamic-v1';

const urlsToCache = [
  '/', '/index.html', /* ... demais páginas */
];

self.addEventListener('install', event => {
  self.skipWaiting();
  // Opcional: ainda pode precachear, mas NÃO usará offline
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(err => {
        console.warn('Falha ao cachear alguns recursos:', err);
      });
    })
  );
});

// 👇 FETCH: SEMPRE tenta da rede, NUNCA usa cache como fallback
self.addEventListener('fetch', event => {
  // Ignora extensões do Chrome
  if (event.request.url.startsWith('chrome-extension://')) return;

  // Para navegação (HTML)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Está offline → não permite carregar página
        return new Response('<h1>Offline</h1><p>É necessário estar conectado à internet para acessar este conteúdo.</p>', {
          headers: { 'Content-Type': 'text/html' },
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
    );
    return;
  }

  // Para outros recursos (CSS, JS, imagens, etc.)
  event.respondWith(
    fetch(event.request).catch(() => {
      // Opcional: pode retornar um recurso vazio ou erro
      return new Response('', { status: 503 });
    })
  );
});

// Ativação (mantém limpeza, mas opcional)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (![CACHE_NAME, DYNAMIC_CACHE].includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => clients.claim())
  );
});
