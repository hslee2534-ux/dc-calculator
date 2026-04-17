const CACHE = 'dccalc-v2';
const PRECACHE = [
  '/',
  '/yangsedo.html',
  '/silsuryeong.html',
  '/geonbo.html',
  '/jeungyese.html',
  '/guide.html',
  '/about.html',
  '/contact.html',
  '/privacy.html',
  '/favicon.svg',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // HTML은 네트워크 우선 (항상 최신 콘텐츠)
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/'))
    );
    return;
  }
  // 그 외는 캐시 우선
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
