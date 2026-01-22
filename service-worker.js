const CACHE_NAME = 'plano-aula-v2.3.0';
const DYNAMIC_CACHE = 'plano-aula-dynamic-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/sobre.html',
  '/.well-known/assetlinks.json',
  '/termos.html',
];

// ==================== INSTALAÇÃO ====================
self.addEventListener('install', event => {
  self.skipWaiting(); // Ativa imediatamente
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache instalado:', CACHE_NAME);
      return cache.addAll(urlsToCache).catch(error => {
        console.log('Falha ao cachear alguns recursos:', error);
      });
    })
  );
});

// ==================== ESTRATÉGIA DE CACHE ====================
self.addEventListener('fetch', event => {
  // Ignora requisições de extensões do Chrome
  if (event.request.url.startsWith('chrome-extension://')) return;
  
  // Para navegação (HTML), tenta rede primeiro
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Atualiza cache com nova versão
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Se offline, serve do cache
          return caches.match(event.request) || 
                 caches.match('/index.html');
        })
    );
    return;
  }
  
  // Para outros recursos, cache-first com atualização
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        // Atualiza o cache em background
        caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      }).catch(() => {
        // Se offline, retorna do cache
        return cachedResponse;
      });
      
      // Retorna cache imediatamente, atualiza em background
      return cachedResponse || fetchPromise;
    })
  );
});

// ==================== ATIVAÇÃO ====================
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Limpa caches antigos
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (![CACHE_NAME, DYNAMIC_CACHE].includes(cacheName)) {
              console.log('Removendo cache antigo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Assumir controle imediato de todas as abas
      clients.claim()
    ]).then(() => {
      // Notifica todas as abas sobre a atualização
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: CACHE_NAME
          });
        });
      });
    })
  );
});

// ==================== COMUNICAÇÃO ====================
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data === 'UPDATE_CACHE') {
    self.registration.update();
  }
});
