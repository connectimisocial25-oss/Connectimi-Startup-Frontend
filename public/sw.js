// ── Connectimi Service Worker ──────────────────────────────────────────────
// CACHE_VERSION only forces a one-time purge of old caches. You should NOT
// need to bump it to ship fresh assets — see the strategy notes below.
const CACHE_VERSION = "v5";
const CACHE_NAME = `connectimi-cache-${CACHE_VERSION}`;

// Assets to pre-cache on install (shell)
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/Connectimi_logo.ico",
  "/Connectimi_logo.png",
];
const isImmutable = (url) => url.pathname.startsWith("/assets/");

const CACHEABLE_DESTINATIONS = ["script", "style", "image", "font"];

// Store only real, complete, same-origin 200s. Caching a 404/500 HTML error
// page under a route is how a bad deploy gets frozen in place.
const cachePut = (request, response) => {
  if (response && response.status === 200 && response.type === "basic") {
    const clone = response.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
  }
  return response;
};

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

  // cache.put() throws on anything but GET.
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigation (HTML) → network-first, cached index.html as offline fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => cachePut(request, response))
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  if (!CACHEABLE_DESTINATIONS.includes(request.destination)) return;

  // Hashed build output → cache-first, it can never go stale.
  if (isImmutable(url)) {
    event.respondWith(
      caches
        .match(request)
        .then((cached) => cached || fetch(request).then((r) => cachePut(request, r)))
    );
    return;
  }

  // Stable URLs → stale-while-revalidate: serve the cached copy instantly,
  // refresh it in the background so the NEXT load is current.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => cachePut(request, response))
        .catch(() => cached);
      event.waitUntil(network); // keep the refresh alive after we respond
      return cached || network;
    })
  );
});
