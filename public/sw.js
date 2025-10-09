self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('ads-v1').then((cache) => cache.addAll(['/offline']))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match('/offline'))
  )
})


