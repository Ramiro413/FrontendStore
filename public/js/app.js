var url = window.location.href;
var swLocation = '/ejemplo-sincronizacion/sw.js';
var swReg;

if ( navigator.serviceWorker ) {


    if ( url.includes('localhost') ) {
        swLocation = '/sw.js';
    }

    window.addEventListener('load', () => {

        navigator.serviceWorker.register( swLocation ).then( reg => {
            swReg = reg;
            swReg.pushManager.getSubscription().then( verificaSuscripcion );

        });

    });
}

var postBtn     = $('#post-btn');


// El usuario, contiene el ID del usuario en sesión
var usuario;




function verificaSuscripcion( activadas ) {

  // Verificar el estatus para ver que boton se tiene que activar
  if ( activadas ) {
      btnActivadas.removeClass('oculto');
      btnDesactivadas.addClass('oculto');

  } else {
      btnActivadas.addClass('oculto');
      btnDesactivadas.removeClass('oculto');
  }

}

//verificaSuscripcion();

function getPublicKey() {

  return fetch('api/key')
      .then( res => res.arrayBuffer())
      // returnar arreglo, pero como un Uint8array
      .then( key => new Uint8Array(key) );


}


function cancelarSuscripcion() {
  swReg.pushManager.getSubscription().then( subs => {
      subs.unsubscribe().then( () => verificaSuscripcion(false) );
  });
}

/* if(window.caches){
    caches.open("cache-1")
    .then(cache=>{
       cache.addAll([
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
        "/js/app.js"

       ])
    })
} */
var db = new PouchDB('todos');
var foto = null;
//Camara 
var btnPhoto = $("#photo-btn");
var btnTomarFoto = $("#tomar-foto-btn");
var contenedorCamara = $(".camara-contenedor");

const camara = new Camara($("#player")[0]);

btnPhoto.on("click", () => {

  console.log("boton camara");
  contenedorCamara.removeClass("oculto");
  camara.encender();
});

btnTomarFoto.on("click", () => {

  console.log("boton tomar foto");
  foto = camara.tomaraFoto();
  localStorage.setItem("imgData", foto);
  console.log(foto);
  camara.apagar();

});
function guardarUsuario() {
  var newTodoDom = document.getElementById('usuario');
 

  var todo = {
    _id: "user",
    usuario: newTodoDom.value
  };

  /*     db.post(todo, function(err, result) {
        if (!err) {
          console.log('Successfully posted a todo!');
        }
      }); */
  db.post(todo)
    .then(resp => {
      notificarme(0)
      console.log("Se guardo el registro");
    })
    .catch(error => {
      console.log(error);
    });
}



function deleteUser() {
  db.get('user').then(resp => {
    db.remove(resp, function (err) {
      if (err) {
        return console.log(err);
      } else {
        console.log("Se elimino correctamente");
        notificarme(1)
        window.location.href = "index.html";
      }
    });
  })
}


function verificarConexion(){
  if(navigator.onLine){
      console.log("Si hay conexión")
  }else{
      console.log("No hay conexión");
  }
}

window.addEventListener("online", verificarConexion);
window.addEventListener("offline", verificarConexion);

//NOTIFICACIONES
var btnActivadas    = $('.btn-noti-activadas');
var btnDesactivadas = $('.btn-noti-desactivadas');

function notificarme(valor) {

    if ( Notification.permission === 'granted' ) {
        if(valor == 1){
          ELiminarUsuNoti()
        }else{
          newUsuNoti()
        }
        

    } else if ( Notification.permission !== 'denied' || Notification.permission === 'default' )  {

        // Se le pide autorizacion al usuario para enviar notificaciones
        Notification.requestPermission( function( permission ) {

            console.log( "Permiso otorgado:", permission );

            // El usuario si acepto el envio de notifcaciones
            if ( permission === 'granted' ) {
                console.log("Si hay permiso");
                if(valor == 1){
                  ELiminarUsuNoti()
                }else{
                  newUsuNoti()
                }
                
            }

        });

    }
}
//notificarme();

function ELiminarUsuNoti() {

  const notificationOpts = {
      body: 'Se cerro sesión y se elimino el usuario',
      icon: 'img/icons/32x32.png'
  };

  const n = new Notification('Sesión finalizada', notificationOpts);

  // Por si se requiere realizar una acción cuando se de clic sobre la notificación
  n.onclick = () => {
      console.log('Le diste clic a la notificación');
  };

}
function newUsuNoti() {

  const notificationOpts = {
      body: 'Se creo el usuario',
      icon: 'img/icons/32x32.png'
  };

  const n = new Notification('Nuevo Usuario', notificationOpts);

  // Por si se requiere realizar una acción cuando se de clic sobre la notificación
  n.onclick = () => {
      console.log('Le diste clic a la notificación');
  };

}
