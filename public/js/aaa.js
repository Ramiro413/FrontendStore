var txtMensaje = $('#txtMensaje');
var timeline = $('#timeline');
var postBtn = $('#post-btn');
var modal       = $('#modal-mapa');







function crearMensajeHTML(mensaje, user, lat, lng) {
    var content = `
    <li class="animated fadeIn fast"`;
if(user == "Admin"){
    content += `data-user="${user}"`
}else{
    content += `data-user="Tu"`
    
}
   
    content += `        data-mensaje="${mensaje}"
        data-tipo="mensaje">


        <div class="avatar">`;
    if (user == "Admin") {
        content += `<img src="img/user.png">`;
    } else {
        var imgUser = localStorage.getItem("imgData");
        content += `<img src="${imgUser}">`;
    }


    content += `</div>
        <div class="bubble-container">
            <div class="bubble">`;
            if(user == "Admin"){
                content += `<h3>@${user}</h3>`
            }else{
               
                    content +=   `<h3>@Tu</h3>` ;
               
                
            }
            
            content += `<br />
                ${mensaje}
                `;



    content += `</div>
            <div class="arrow"></div>
        </div>
        </li >
        `;


    // si existe la latitud y longitud, 
    // llamamos la funcion para crear el mapa
    if (lat) {
        crearMensajeMapa(lat, lng, user);
    }

    // Borramos la latitud y longitud 
    lat = null;
    lng = null;

    $('.modal-mapa').remove();

    timeline.prepend(content);
    //cancelarBtn.click();

}
// Boton de enviar mensaje
postBtn.on('click', function () {

    var mensaje = txtMensaje.val();
    if (mensaje.length === 0) {
        return;
    }

    var data = {
        user: usuario,
        mensaje: mensaje,
        lat: lat,
        lng: lng
    }

    fetch("/api", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(resp => resp.json())
        .then(resp => console.log("funciona:", resp))
        .catch(error => console.log("Falla: ", error));

    crearMensajeHTML(mensaje, usuario, lat, lng);

});


function listarMensajes() {

    fetch("/api")
        .then(resp => resp.json())
        .then(datos => {
            //console.log( datos );
            datos.forEach(mensaje => {
                crearMensajeHTML(mensaje.mensaje, mensaje.user, mensaje.lat, mensaje.lng);
            });
        });

}

listarMensajes();
// Boton de enviar mensaje
/* postBtn.on('click', function() {

  var mensaje = txtMensaje.val();
  if ( mensaje.length === 0 ) {
      cancelarBtn.click();
      return;
  }

  var data  = {
      user: usuario,
      mensaje :mensaje
  }

  fetch("/api", {
      method : "POST",
      headers : {
          "Content-Type" : "application/json"
      },
      body : JSON.stringify( data )
  })
  .then( resp => resp.json() )
  .then( resp => console.log("funciona:", resp))
  .catch( error => console.log("Falla: ", error) );

  crearMensajeHTML( mensaje, usuario,  );

}); */

listarMensajes();

btnDesactivadas.on('click', () => {

    // verificar si ya se registro el service worker
    if (!swReg) return console.log('No hay registro de SW');

    getPublicKey().then(key => {

        // Realizar la subscripcion del service worker
        swReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: key
        })
            .then(res => res.toJSON())
            .then(suscripcion => {

                // Enviar la subscripion al servidor 
                fetch('api/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(suscripcion)
                })
                    .then(verificaSuscripcion)
                    .catch(cancelarSuscripcion);

            });
    });
});

btnActivadas.on('click', function () {
    cancelarSuscripcion();
});

// GEOLOCALIZACION

var googleMapKey = 'AIzaSyA5mjCwx1TRLuBAjwQw84WE6h5ErSe7Uj8';
var btnLocation = $("#location-btn");
var modaMapa = $(".modal-mapa");
var lat = null;
var lng = null;
var foto = null;

btnLocation.on("click", () => {
    console.log(" geolocalización");

    navigator.geolocation.getCurrentPosition(posicion => {
        console.log(posicion);

        mostrarMapaModal(posicion.coords.latitude, posicion.coords.longitude);

        lat = posicion.coords.latitude;
        lng = posicion.coords.longitude;
    });

});

function mostrarMapaModal(lat, lng) {

    modal.removeClass('oculto');
    
    var content = `
            <div class="modal-mapa">
                <iframe
                    width="100%"
                    height="250"
                    frameborder="0"
                    src="https://www.google.com/maps/embed/v1/view?key=${googleMapKey}&center=${lat},${lng}&zoom=17" allowfullscreen>
                    </iframe>
            </div>
            
    `;

    modal.append(content);
}




function crearMensajeMapa(lat, lng, personaje) {


    let content = `
    <li class="animated fadeIn fast"
        data-tipo="mapa"
        data-user="Tu"
        data-lat="${lat}"
        data-lng="${lng}">
                <div class="avatar">`;
                var imgUser = localStorage.getItem("imgData");
                 content += `<img src="${imgUser}">
                </div>
                <div class="bubble-container">
                    <div class="bubble">
                        <iframe
                            width="100%"
                            height="250"
                            frameborder="0" style="border:0"
                            src="https://www.google.com/maps/embed/v1/view?key=${googleMapKey}&center=${lat},${lng}&zoom=17" allowfullscreen>
                            </iframe>
                    </div>
                    
                    <div class="arrow"></div>
                </div>
            </li> 
    `;

    timeline.prepend(content);
}
