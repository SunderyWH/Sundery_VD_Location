// sw.js
const CACHE_NAME = 'vm-locator-cache-v2'; // increment this version when you make big changes
const urlsToCache = [
  '/', // caches your index.html initially
  '/style.css', // if you have a separate CSS file
  '/logo.png', // your logo
  // add other static files here if any
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching app assets...');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // forces the SW to activate immediately
});

self.addEventListener('activate', event => {
  // Clean up old caches automatically
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('Removing old cache:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    // Always try to get fresh index.html from network first
    event.respondWith(
      fetch(event.request)
        .then(response => {
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // For other assets, use cache first then network
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});
