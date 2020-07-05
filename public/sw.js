const staticCacheName = 'site-static-v1';
const assets = [
  '/',
  '/index.html',
  '/assets/js/ui.min.js',
  '/assets/js/app.js',
  '/assets/js/Chart.min.js',
  '/assets/css/style.min.css',
  '/assets/css/Chart.min.css',
  '/assets/images/192x192.png',
  '/assets/images/512x512.png',
  '/assets/images/logo.png',
  '/assets/images/fav.ico',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap',
  'https://fonts.googleapis.com/css2?family=Open+Sans&display=swap',
];

// install event
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});
// activate event
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});
// When we change the name we could have multiple cache, to avoid that we need to delet the old cache, so with this function we check the key that is our cache naming, if it is different from the actual naming we delete it, in this way we will always have only the last updated cache.
// fetch event
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});