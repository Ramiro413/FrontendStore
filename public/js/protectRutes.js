window.onload = (event) => {

    db.get('user').then(resp => {
        const h1Usuario = document.getElementById('USUARIONAME');
        
 
        h1Usuario.innerHTML = `Bienvenido: ` + resp.usuario ;

    }).catch(error => {
        window.location.href = "index.html"
    })
    if (localStorage.getItem("imgData") != null) {
        var imgUs = document.getElementById('imgUsuario');
        var img = localStorage.getItem("imgData");
        imgUs.innerHTML = `<img class="imgAvatar" src="`+ img+`" > `  ;
        //Aqui se ejecuta todo si no existe
      }
};
