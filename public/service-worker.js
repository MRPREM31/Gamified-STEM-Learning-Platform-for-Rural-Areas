// Service Worker Version
const CACHE_VERSION = 'v1';
const CACHE_NAME = `eduquest-cache-${CACHE_VERSION}`;

// Resources to cache
const RESOURCES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/assets/badges-set.png',
  '/assets/hero-education.jpg',
  '/assets/stem-background.jpg',
  '/assets/eduquest icon.png'
];

// API Routes to cache
const API_ROUTES = [
  '/api/subjects',
  '/api/quizzes'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(RESOURCES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('eduquest-cache-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (API_ROUTES.some(route => url.pathname.includes(route))) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, clonedResponse);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Handle static assets and navigation requests
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Background Sync for Quiz Results
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-quiz-results') {
    event.waitUntil(syncQuizResults());
  }
});

// Function to sync stored quiz results
async function syncQuizResults() {
  try {
    const db = await openIndexedDB();
    const pendingResults = await db.getAll('pendingQuizResults');
    
    for (const result of pendingResults) {
      try {
        const response = await fetch('/api/quiz-results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(result),
        });

        if (response.ok) {
          await db.delete('pendingQuizResults', result.id);
        }
      } catch (error) {
        console.error('Failed to sync result:', error);
      }
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// IndexedDB setup for offline data
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('EduQuestDB', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingQuizResults')) {
        db.createObjectStore('pendingQuizResults', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}