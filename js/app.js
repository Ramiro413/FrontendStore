
if(navigator.serviceWorker){
    navigator.serviceWorker.register("/sw.js");
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
        console.log("Se guardo el registro");
      })
      .catch(error => {
        console.log(error);
      });
  }



  function deleteUser(){
    db.get('user').then(resp => {
    db.remove(resp, function(err) {
      if (err) {
         return console.log(err);
      } else {
         console.log("Se elimino correctamente");
         window.location.href = "index.html";
      }
   });
  })
  }