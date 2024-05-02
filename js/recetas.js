function mostrarInfoReceta(){
    let auxString;
    let idReceta;
    auxString = location.search.substring(1);
    idReceta = auxString.split("=")[1];

    if(idReceta === '' |isNaN(idReceta)){
        location.href = 'index.html';
    }else{
        let url = 'api/recetas', xhr = new XMLHttpRequest();
        url += '/' + idReceta;
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function(e){
            let r = xhr.response;

            if(r.RESULTADO == 'OK'){
                    let receta = r.FILAS[0];
                    document.querySelector('h1').innerHTML = receta.nombre;
                    document.querySelector('p').innerHTML = receta.elaboracion;
                    //Pedir ingredientes
                    /*mostrarIngredientes(idReceta);
                    url='api/recetas/' + idReceta + '/ingredientes';*/
            }
        }
        xhr.send();
    }
}