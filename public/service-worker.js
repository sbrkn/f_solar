const CACHE_NAME = 'f-solar-v1';
const STATIC_CACHE = 'f-solar-static-v1';
const DYNAMIC_CACHE = 'f-solar-dynamic-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch event - cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip API routes - network only
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(
          JSON.stringify({ error: 'You are offline' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        )
      )
    );
    return;
  }

  // Skip Firebase/Google requests
  if (
    url.hostname.includes('firebase') ||
    url.hostname.includes('google') ||
    url.hostname.includes('googleapis')
  ) {
    return;
  }

  // Static assets - Cache First
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff|woff2)$/) ||
    url.pathname.startsWith('/_next/static/')
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
            }
            return response;
          })
      )
    );
    return;
  }

  // HTML pages - Network First with fallback
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then(
            (cached) =>
              cached ||
              caches.match('/').then(
                (home) =>
                  home ||
                  new Response('Offline - Please connect to the internet', {
                    status: 503,
                  })
              )
          )
        )
    );
    return;
  }

  // Default - Stale While Revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      });
      return cached || networkFetch;
    })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const options = {
    body: data.body || 'New notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
    actions: [
      { action: 'view', title: 'View', icon: '/icons/icon-72x72.png' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'F-Solar', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'view' || !event.action) {
    const url = event.notification.data?.url || '/';
    event.waitUntil(
      clients
        .matchAll({ type: 'window' })
        .then((clientList) => {
          for (const client of clientList) {
            if (client.url === url && 'focus' in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow(url);
          }
        })
    );
  }
});

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-documents') {
    event.waitUntil(syncDocuments());
  }
});

async function syncDocuments() {
  // Get pending sync items from IndexedDB and sync to server
  console.log('[SW] Background sync: syncing documents...');
}
