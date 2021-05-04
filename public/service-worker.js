const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

const FILES_TO_CACHE = [
    '/',
    '/manifest.webmanifest',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/db.js',
    '/dbcompressed.js',
    '/index.html',
    '/index.js',
    '/styles.css'
];

self.addEventListener("install",  (evt) => {
    //
    evt.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log("Your files were pre-cached successfully!");
            console.log(cache);
            return cache.addAll(FILES_TO_CACHE);
        })
    );

});


self.addEventListener("activate", function (evt) {
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME) {
                        console.log("Removing old cache data", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );

    self.clients.claim();
});


self.addEventListener("fetch", function (evt) {

    evt.respondWith(
        caches.open(CACHE_NAME)
        .then ((cache) => {
            return cache.match(evt.request)
            .then((response) => {
                return response || fetch(evt.request)
            })
        })
    );
})

