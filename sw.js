  const CACHE_NAME = "limpeza-pro-v12";

const ARQUIVOS = [
    "./",
    "./index.html",
    "./manifest.json"
];

self.addEventListener("install", event => {
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ARQUIVOS);
        })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(chaves => {
            return Promise.all(
                chaves
                    .filter(chave => chave !== CACHE_NAME)
                    .map(chave => caches.delete(chave))
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(resposta => {

                const copia = resposta.clone();

                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, copia);
                });

                return resposta;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );

});
