// ── Connectimi Service Worker ──────────────────────────────────────────────
// Bump CACHE_VERSION every time you deploy so phones get fresh assets.
const CACHE_VERSION = "v3";
const CACHE_NAME = `connectimi-cache-${CACHE_VERSION}`;

// Assets to pre-cache on install (shell)
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/Connectimi_logo_favicon.png",
  "/Connectimi_logo.png",
];

// ── Install: pre-cache shell assets ───────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()) // activate immediately
  );
});

// ── Activate: delete ALL old caches ───────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME) // keep only current version
            .map((key) => {
              console.log("[SW] Deleting old cache:", key);
              return caches.delete(key);
            })
        )
      )
      .then(() => self.clients.claim()) // take control of all open tabs/pages
  );
});

// ── Fetch: Network-first for navigation, Cache-first for assets ────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Navigation requests (HTML pages) → Network first, fallback to /index.html
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache fresh copy
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          // Offline fallback: serve cached index.html for SPA routing
          caches.match("/index.html")
        )
    );
    return;
  }

  // Static assets (JS, CSS, images) → Cache first, then network
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image" ||
    request.destination === "font"
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (!response || response.status !== 200) return response;
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  // All other requests: pass through to network
});
