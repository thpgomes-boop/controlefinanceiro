// Network-first: sempre tenta a versão nova; usa cache só se estiver offline.
const C = 'fin-v2';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => clients.claim())
));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || !u.protocol.startsWith('http') || u.hostname.includes('google.com') || u.hostname.includes('googleusercontent')) return;
  e.respondWith(
    fetch(e.request).then(r => { const c = r.clone(); caches.open(C).then(x => x.put(e.request, c)); return r; })
      .catch(() => caches.match(e.request))
  );
});
