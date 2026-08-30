const CACHE_NAME = "precio-luz-v1";
const OFFLINE_URL = "/offline.html";

async function cacheResponse(request, response) {
  if (!response.ok) {
    return;
  }

  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
}

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    const responsePromise = fetch(request);

    event.waitUntil(
      responsePromise
        .then((response) => cacheResponse(request, response))
        .catch(() => undefined)
    );
    event.respondWith(
      responsePromise.catch(async () => {
        const cachedPage = await caches.match(request);
        return cachedPage || caches.match(OFFLINE_URL);
      })
    );
    return;
  }

  if (url.pathname.startsWith("/_next/static/")) {
    const responsePromise = caches
      .match(request)
      .then((cached) => cached || fetch(request));

    event.waitUntil(
      responsePromise
        .then((response) => cacheResponse(request, response))
        .catch(() => undefined)
    );
    event.respondWith(
      responsePromise
    );
  }
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_URLS" || !Array.isArray(event.data.urls)) {
    return;
  }

  const urls = event.data.urls.filter((url) => {
    try {
      return new URL(url).origin === self.location.origin;
    } catch {
      return false;
    }
  });

  event.waitUntil(
    Promise.all(
      urls.map(async (url) => {
        const response = await fetch(url);
        await cacheResponse(url, response);
      })
    ).catch(() => undefined)
  );
});
