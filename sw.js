/**
 * AllNighter v2 - Service Worker
 * 
 * Provides offline functionality, caching, and PWA features
 * 
 * @author Julián LR, Lucas Salmerón Olschansky, Julián Moreira
 * @version 2.0.0
 * @license MIT
 */

const CACHE_NAME = 'allnighter-v2.0.0';
const CACHE_VERSION = '2.0.0';

// Files to cache for offline functionality
const STATIC_CACHE_FILES = [
  '/',
  '/index.html',
  '/pages/esp.html',
  '/pages/eng.html',
  '/css/styles.css',
  '/css/styles.min.css',
  '/js/config.js',
  '/js/utils.js',
  '/js/security.js',
  '/js/esp-logic.js',
  '/js/eng-logic.js',
  '/js/local-storage-redirect.js',
  '/img/AN-logo.png',
  '/img/favicon.png',
  '/img/ar.png',
  '/img/us.png',
  '/img/white-lines.png',
  '/manifest.json'
];

// Dynamic cache for Bootstrap and other external resources
const DYNAMIC_CACHE_NAME = `${CACHE_NAME}-dynamic`;
const EXTERNAL_RESOURCES = [
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js'
];

// Maximum number of items in dynamic cache
const MAX_DYNAMIC_CACHE_SIZE = 50;

/**
 * Install event - cache static resources
 */
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static files
      caches.open(CACHE_NAME).then(cache => {
        console.log('[ServiceWorker] Caching static files');
        return cache.addAll(STATIC_CACHE_FILES);
      }),
      // Cache external resources
      caches.open(DYNAMIC_CACHE_NAME).then(cache => {
        console.log('[ServiceWorker] Caching external resources');
        return cache.addAll(EXTERNAL_RESOURCES);
      })
    ]).then(() => {
      console.log('[ServiceWorker] Installation complete');
      // Force activation of new service worker
      return self.skipWaiting();
    })
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete old caches
          if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[ServiceWorker] Activation complete');
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

/**
 * Fetch event - serve cached content when offline
 */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      // Return cached version if available
      if (cachedResponse) {
        console.log('[ServiceWorker] Serving from cache:', request.url);
        return cachedResponse;
      }
      
      // For external resources, try network first then cache
      if (url.origin !== location.origin) {
        return fetch(request).then(networkResponse => {
          // Cache successful responses
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
              // Limit cache size
              limitCacheSize(DYNAMIC_CACHE_NAME, MAX_DYNAMIC_CACHE_SIZE);
            });
          }
          return networkResponse;
        }).catch(() => {
          // If network fails, try to serve from dynamic cache
          return caches.match(request).then(fallbackResponse => {
            if (fallbackResponse) {
              return fallbackResponse;
            }
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            throw new Error('Resource not available offline');
          });
        });
      }
      
      // For same-origin requests, try network first
      return fetch(request).then(networkResponse => {
        // Cache successful responses
        if (networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        console.log('[ServiceWorker] Network failed, serving offline content');
        // For HTML requests, serve offline page
        if (request.headers.get('accept').includes('text/html')) {
          return caches.match('/index.html');
        }
        throw new Error('Resource not available offline');
      });
    })
  );
});

/**
 * Background sync for when connectivity is restored
 */
self.addEventListener('sync', event => {
  console.log('[ServiceWorker] Background sync event:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Perform any background tasks here
      console.log('[ServiceWorker] Performing background sync tasks')
    );
  }
});

/**
 * Push notification support
 */
self.addEventListener('push', event => {
  console.log('[ServiceWorker] Push received');
  
  const options = {
    body: event.data ? event.data.text() : 'AllNighter update available',
    icon: '/img/AN-logo.png',
    badge: '/img/favicon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/img/AN-logo.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/img/favicon.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('AllNighter', options)
  );
});

/**
 * Notification click handling
 */
self.addEventListener('notificationclick', event => {
  console.log('[ServiceWorker] Notification click received');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

/**
 * Message handling from main thread
 */
self.addEventListener('message', event => {
  console.log('[ServiceWorker] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      type: 'VERSION_RESPONSE',
      version: CACHE_VERSION
    });
  }
});

/**
 * Utility function to limit cache size
 */
async function limitCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxSize) {
    // Remove oldest entries
    const keysToDelete = keys.slice(0, keys.length - maxSize);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
    console.log(`[ServiceWorker] Cache ${cacheName} trimmed to ${maxSize} items`);
  }
}

/**
 * Utility function to check if user is online
 */
function isOnline() {
  return navigator.onLine;
}

// Log service worker registration
console.log('[ServiceWorker] Service Worker script loaded');
