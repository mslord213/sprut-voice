const CACHE = "sprut-voice-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json"
  // При желании добавьте иконки, CSS, и локальные JS
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", (e) => {
  // Network-first для webhook’ов, cache-first для статики
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(resp => resp || fetch(e.request))
    );
  } else {
    e.respondWith(fetch(e.request).catch(() => caches.match("./")));
  }
});
