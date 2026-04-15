const CACHE = 'taipei-rain-v3';
const ASSETS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // API 請求不快取，直接網路
  if (e.request.url.includes('opendata.cwa.gov.tw') ||
      e.request.url.includes('nominatim.openstreetmap.org') ||
      e.request.url.includes('www.cwa.gov.tw/Data')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // 靜態資源：快取優先
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
