

const CACHE_STATIC_NAME = "static-pwa-v1";
const CACHE_DYNAMIC_NAME = "dynamic-pwa-v1";
const CACHE_INMUTABLE_NAME = "inmutable-pwa-v1";

const APP_SHELL = [
    "/",
    "/index.html",
        "/img/1.jpg",
        "/img/2.jpg",
        "/img/3.jpg",
        "/img/4.jpg",
        "/img/5.jpg",
        "/img/6.jpg",
        "/img/7.jpg",
        "/img/8.jpg",
        "/img/9.jpg",
        "/img/10.jpg",
        "/img/11.jpg",
        "/img/12.jpg",
        "/img/13.jpg",
        "/img/14.jpg",
        "/img/grafico1.jpg",
        "/img/grafico2.jpg",
        "/img/icono_2.png",
        "/img/icono_3.png",
        "/img/icono_4.png",
        "/img/logo.png",
        "/img/nosotros.jpg",
        "/img/icons/16x16.png",
        "/img/icons/32x32.png",
        "/img/icons/180x180.png",
        "/img/icons/192x192.png",
        "/img/icons/512x512.png",
        "/img/icons/favicon.ico",
        "/img/icons/x.png",
        "/manifest.json",
        "/nosotros.html",
        "/pag1.html",
        "/producto.html",
        "/css/style.css",
        "/css/normalize.css",
        "/js/app.js",
        "/js/index.js",
        "/js/protectRutes.js",
   
]
const APP_SHELL_INMUTABLE = [
    "/js/pouchdb-7.3.1.min.js"
]

/* self.addEventListener("install", evento => {
    const promesaCache = caches.open(CACHE_STATIC_NAME)
    .then(cache => {
        
        return cache.addAll(APP_SHELL);
    });
    const cacheInmutable = caches.open(APP_SHELL_INMUTABLE)
    .then(cache => {
        return cache.addAll(APP_SHELL_INMUTABLE);
    })
    evento.waitUntil(Promise.all([promesaCache, cacheInmutable]))
});
 */
self.addEventListener("activate", evento => {
    const respuesta = caches.keys().then(llaves =>{
        llaves.forEach(llave =>{
            if(llave !== CACHE_STATIC_NAME && llave.includes("static")){
                return caches.delete(llave);
            }
            if(llave !== CACHE_DYNAMIC_NAME && llave.includes("dynamic")){
                return caches.delete(llave);
            }

        })
    })
})
self.addEventListener("fetch", evento => {

    const respuesta = caches.match(evento.request)
        .then(respuesta =>{
            if(respuesta){
                return respuesta;
            }else{
                return fetch(evento.request)
                .then(nuevaRespuesta =>{
                    caches.open(CACHE_DYNAMIC_NAME)
                        .then(cache =>{
                            cache.put(evento.request, nuevaRespuesta )
                        })
                    return nuevaRespuesta.clone();
                })
            }
        })
        evento.respondWith( respuesta);
})