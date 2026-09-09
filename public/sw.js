const CACHE_NAME = 'fci-guide-cache-v1';
const CACHE_NAME = 'fci-guide-cache-v2';
const STATIC_ASSETS = [
  '/',
  '/timetable',
  '/resources',
  '/contacts',
  '/news',
  '/calendar',
  '/manifest.json',
  '/images/school-logo-crest.png',
  '/images/school-logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('PWA Pre-cache skipped some resources:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Don't intercept Supabase API requests or chrome-extension requests
  if (url.origin.includes('supabase.co') || url.protocol.startsWith('chrome-extension')) {
  // Don't intercept Supabase API requests, internal api requests, or extensions
  if (url.origin.includes('supabase.co') || url.pathname.startsWith('/api') || url.protocol.startsWith('chrome-extension')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and request fails, return cached response
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// =======================================================
// Web Push Notifications: Background Receiver & Display
// =======================================================
self.addEventListener('push', (event) => {
  let data = {
    title: 'CUSTECH FCI Announcement',
    body: 'New update on the FCI student portal.',
    url: '/',
    icon: '/images/school-logo-crest.png',
  };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/images/school-logo-crest.png',
    badge: '/images/school-logo-crest.png',
    vibrate: [200, 100, 200, 100, 200],
    tag: data.tag || 'fci-notification',
    renotify: true,
    data: {
      url: data.url || '/',
    },
    actions: [
      {
        action: 'open',
        title: 'Open Portal',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
