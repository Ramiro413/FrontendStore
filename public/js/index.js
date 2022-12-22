
window.onload = (event) => {
    db.get('user').then(doc=> {
      
            window.location.href = "pag1.html";
     
    }).catch(error =>{
        console.log(error)
        console.log("Aún no existe usuario")
    });

};
