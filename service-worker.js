const CACHE_NAME = "cockroach-game-v2"; // Changed version number!
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/cockroach.png",
  "/dead-cockroach.png",
  "/slipper.png",
  "/background.mp3",
  "/squash.mp3",
  "/style.css",
  "/script.js"
];

// Install new cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate and delete old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
});

// Fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
