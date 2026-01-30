const CACHE_NAME = 'crisis-app-shell-v1'

// Minimalny zestaw plików do działania offline (app shell)
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      await cache.addAll(APP_SHELL)
      await self.skipWaiting()
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request

  // Tylko GET
  if (req.method !== 'GET') return

  // Dla nawigacji (SPA): offline fallback do index.html
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          return await fetch(req)
        } catch {
          const cache = await caches.open(CACHE_NAME)
          const cached = await cache.match('/index.html')
          return cached || Response.error()
        }
      })(),
    )
    return
  }

  // Cache-first dla pozostałych zasobów statycznych
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      const cached = await cache.match(req)
      if (cached) return cached

      try {
        const res = await fetch(req)
        // Cache'uj tylko sensowne odpowiedzi
        if (res && res.status === 200) {
          cache.put(req, res.clone())
        }
        return res
      } catch {
        return cached || Response.error()
      }
    })(),
  )
})
