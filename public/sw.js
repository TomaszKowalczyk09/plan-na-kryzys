/// <reference lib="webworker" />

// Workbox (vite-plugin-pwa, strategy: injectManifest)
import { cleanupOutdatedCaches, precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

// Precache wszystkiego co Vite zbuduje (inject manifest)
// eslint-disable-next-line no-underscore-dangle
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

// SPA fallback -> index.html
const handler = createHandlerBoundToURL('/index.html')
registerRoute(new NavigationRoute(handler))

// Runtime caching: Google Fonts
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  }),
)

registerRoute(
  ({ url }) => url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  }),
)

// Opcjonalnie: pozwala szybciej przejąć kontrolę po update (autoUpdate i tak robi swoje)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting()
})
