const CACHE = 'sgd-excursio-v1';
const ASSETS = [
  '/admin.html',
  '/profes.html',
  '/datos.html',
  '/manifest_admin.json',
  '/manifest_profes.json',
  '/manifest_datos.json',
  '/icons/admin/icon-admin-192.png',
  '/icons/admin/icon-admin-512.png',
  '/icons/profes/icon-profes-192.png',
  '/icons/profes/icon-profes-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(r => {
        const c = r.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, c));
        return r;
      })
      .catch(() => caches.match(e.request))
  );
});
