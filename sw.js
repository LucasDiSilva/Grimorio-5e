const CACHE = "grimorio-shell-v12";
const FILES = ["./", "./index.html", "./manifest.json", "./icon.svg", "./cards.js", "./cards.css", "./combat.js", "./combat.css", "./skills.js", "./skills.css", "./weapons.js", "./weapons.css", "./bag.js", "./bag.css", "./magic-stats.js", "./magic-stats.css", "./special-items.js", "./special-items.css"];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES))));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); }
    return response;
  })));
});
