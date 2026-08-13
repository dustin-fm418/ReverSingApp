// ReverSing! service worker — minimal offline cache.
//
// This file must sit in the SAME folder as index.html and be served over
// http/https (GitHub Pages, Netlify, Vercel, etc.) — it does nothing when
// the app is just opened as a local file, and that's expected.
//
// Strategy: network-first. Every request tries the real network first (so
// you always get your latest edits while online) and only falls back to
// the cached copy when there's no connection. That avoids the classic PWA
// trap of getting stuck on a stale cached version while you're iterating.

const CACHE_NAME = "reversing-cache-v1";
const APP_SHELL = ["./", "./index.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch(() => {}) // don't block install if the shell can't be pre-cached yet
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cached) => cached || caches.match("./index.html"))
      )
  );
});
