self.addEventListener('install', function(event) {
  console.log('Service Worker installed');
});

self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});
self.addEventListener('install', e => console.log('Service Worker Installed'));
self.addEventListener('activate', e => console.log('Service Worker Activated'));

