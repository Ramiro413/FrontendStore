window.onload = (event) => {

    db.get('user').then(resp => {
        const h1Usuario = document.getElementById('USUARIONAME');
        
 
        h1Usuario.innerHTML = `Bienvenido: ` + resp.usuario ;

    }).catch(error => {
        window.location.href = "index.html"
    })
};
