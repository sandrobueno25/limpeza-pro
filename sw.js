const CACHE_NAME = "limpeza-pro-v11-offline";

const ARQUIVOS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ARQUIVOS);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(chaves => {
      return Promise.all(
        chaves
          .filter(chave => chave !== CACHE_NAME)
          .map(chave => caches.delete(chave))
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request).then(resposta => {

      if (resposta) {
        return resposta;
      }

      return fetch(event.request)
        .then(resposta => {

          const copia = resposta.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, copia);
          });

          return resposta;

        })
        .catch(() => {

          return caches.match("./index.html");

        });

    })

  );

});
