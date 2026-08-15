# Service Worker (PWA)

`reversing-deploy/sw.js`

## What it owns

Offline caching for the deployed game, registered from the end of
`reversing-deploy/index.html` (see
[Init & Playtest Seed](init-and-playtest-seed.md)) — only when served over
http/https, never when opened as a local `file://`.

## Strategy: network-first

Deliberately **not** cache-first, per the file's own header comment: every
`GET` request tries the network first (so players always get the latest
deployed edit while online) and only falls back to the cached copy —
`caches.match(event.request)`, falling back again to the cached
`./index.html` — when the network fetch fails. This avoids the common PWA
failure mode of a client getting stuck on a stale cached build while
online.

## Lifecycle

- `install` — pre-caches the minimal app shell (`["./", "./index.html"]`)
  into `reversing-cache-v1`, and calls `self.skipWaiting()` so a new
  service worker takes over immediately rather than waiting for all tabs
  to close.
- `activate` — deletes any cache whose name doesn't match the current
  `CACHE_NAME`, then `self.clients.claim()`s existing open tabs.
- `fetch` — network-first as described above; non-`GET` requests are
  ignored entirely (passed through, not intercepted).

## Versioning note

`CACHE_NAME` is hardcoded as `"reversing-cache-v1"`. Since the fetch
handler already re-caches every successful network response, this constant
mainly matters for forcing a clean slate (bump it to invalidate all
previously cached entries) rather than for normal day-to-day updates,
which the network-first strategy already handles.
