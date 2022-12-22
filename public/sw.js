

importScripts("js/pouchdb-7.3.1.min.js");
importScripts("js/sw-db.js");
importScripts("js/sw-utils.js");

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
        "js/sw-utils.js",
        "js/sw-db.js",
        "js/camara-class.js"
   
]
const APP_SHELL_INMUTABLE = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js",
    "https://fonts.googleapis.com/css2?family=Staatliches&display=swap",
    "https://use.fontawesome.com/releases/v6.1.0/js/all.js",
    "https://fonts.googleapis.com/css?family=Montserrat:400,700",
    "https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic" ,
    "/js/pouchdb-7.3.1.min.js"
]

self.addEventListener("install", evento => {
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
    evento.waitUntil(respuesta);
})
self.addEventListener("fetch", (evento) => {

    let respuesta;
    if( evento.request.url.includes("/api") ){

        respuesta = manejarPeticionesApi(CACHE_DYNAMIC_NAME, evento.request);

    }else{

        respuesta = caches.match(evento.request).then((res) => {
            if (res) {
                verificarCache(CACHE_STATIC_NAME, evento.request, APP_SHELL_INMUTABLE);
                return res;

            } else {
                return fetch(evento.request).then((newRes) => {
                    return actualizaCache(CACHE_DYNAMIC_NAME, evento.request, newRes);
                });
            }
    });
    }

    evento.respondWith(respuesta);
});

self.addEventListener("sync", evento => {
    //console.log("SW: Sync");

    if( evento.tag === "nuevo-mensaje"){
        const respuesta = enviarMensajes();
        evento.waitUntil( respuesta );
    }
} );
self.addEventListener('push', e => {

    const data = JSON.parse( e.data.text() );

    const title = data.titulo;
    const options = {
        body: data.cuerpo,       
        icon: `img/avatars/${ data.usuario }.jpg`,
        badge: 'img/favicon.ico',
        image: 'https://as01.epimg.net/meristation/imagenes/2022/09/09/reportajes/1662739276_405887_1662795061_noticia_normal_recorte1.jpg',
        vibrate: [125,75,125,275,200,275,125,75,125,275,200,600,200,600],
        openUrl: '/',
        data: {            
            url: '/',
            id: data.usuario
        },
        // accciones personalizadas: editar, eliminar o lo que se requiera
        actions: [
            {
                action: 'admin-action',
                title: 'User',
                icon: 'img/avatars/goku.jpg'
            },
            {
                action: 'user-action',
                title: 'User',
                icon: 'img/avatars/vegeta.jpg'
            }
        ]
    };

    e.waitUntil( self.registration.showNotification( title, options) );
});

// Evento para cerrar la notificacion
self.addEventListener('notificationclose', e => {
    console.log('Notificación cerrada', e);
});

// Evento cuando se da clic sobre la notificacion
self.addEventListener('notificationclick', e => {
    // Para tener una mejor refrencia a las opcion de las notificaciones
    const notificacion = e.notification;
    const accion = e.action;

    console.log({ notificacion, accion });

    // obtiene todas las pestañas abiertas en el navegador
    const respuesta = clients.matchAll()
        .then( clientes => {

            let cliente = clientes.find( c => {
                return c.visibilityState === 'visible';
            });

            if ( cliente !== undefined ) {
                cliente.navigate( notificacion.data.url );
                cliente.focus();
            } else {
                clients.openWindow( notificacion.data.url );
            }

            return notificacion.close();
        });

    e.waitUntil( respuesta );
});
