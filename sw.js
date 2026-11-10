// MERGED: SMART MOVE GAME + Monetag Ads - v17
self.options = {
  "domain": "5gvci.com",
  "zoneId": 12183954
};
self.lary = "";
importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw');

const CACHE_NAME = 'smart-move-v17';
const APP_FILES = [
  './',
  './index.html',
  './quiz.html',
  './results.html',
  './style.css',
  './questions.js',
  './app.js',
  './pwa.js',
  './manifest.webmanifest',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './IMG-20261025-WA2280.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith('smart-move-') && cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);

  // IMPORTANT: Never cache / block Monetag ads - let them go to network
  if (requestUrl.hostname.includes('5gvci.com') || requestUrl.hostname.includes('monetag') || requestUrl.hostname.includes('groleegni')) {
    return;
  }

  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request, {
      ignoreSearch: event.request.mode === 'navigate'
    }).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((response) => {
        if (!response || !response.ok) return response;
        const responseCopy = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseCopy);
        }).catch((error) => console.error('Unable to cache app file.', error));
        return response;
      });
    })
  );
});
