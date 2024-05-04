'use strict';

/*
    He hecho las peticiones creando objetos de tipo promesa, pero se 
    pueden hacer también de esta forma:
    const token = 'usuario1:cdbsjdbbkvsdbkv';
    fetch('http://localhost:3000/api/recetas/${id}', {
         method: 'POST',
         // Datos en enviar a la API. (Solo POST y PUT)
         body: {
             "usuario": "pepito",
             "password": "1234"
         },
         // Content-Type: application/json -> Formato de envío de body
         // Authorization: {token} -> Se envía el token para autenticarse
        headers: {
             "Content-Type": "application/json",
             "Authorization": token,
        }
    }).then(res => res.json()).then(res => console.log(res));
*/

/***********************************************************
                        PETICIONES GET
***********************************************************/

// Busca si hay disponibilidad del Login
function getDisponibilidadLogin(login){
    const url = `api/usuarios/${login}`;
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = () => {
            let disponible = xhr.response;
            resolve(disponible);
        };
        xhr.send();
    });
}

// Petición de todas las etiquetas guardadas en la BD
function getEtiquetas() {
    let url = 'api/etiquetas';
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = () => {
            let etiquetas = xhr.response;
            resolve(etiquetas);
        };

        xhr.send();
    });
}

// Devuelve toda la información de la receta con el ID indicado
function getRecetas(id){
    let url = 'api/recetas';
    xhr = new XMLHttpRequest();

    url += '?reg=0&cant='+ cantidad; // Carga una cantidad de recetas
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function(){
        let r = xhr.response;

        if(r.RESULTADO == 'OK'){
            let html = '';
            let numFilas = r.FILAS;
            r.FILAS.forEach(function(receta) {
                html += `
                <div class="articles-container">
                <article>
                    <div class="tooltip">
                        <a href="receta.html"><h2 class="articles-title">Pizza vegetariana italiana casera, echa con ingredientes finos</h2></a>
                        <span class="tooltiptext">Pizza vegetariana italiana casera, echa con ingredientes finos</span>
                    </div><br>
                    <div class="article-autor">
                        <h3>Autor: <span>Rosmery Jimenez Gonzales</span></h3>
                        <time datetime = "2023-03-02">2023-03-02</time>
                    </div>
                    <a href="receta.html"><img src="./fotos/pizza.jpg" alt="Foto de la receta"  class="img-receta" ></a>

                    <div class="receta-info">
                        <span   class="receta-info-personas">
                            <i class="fa fa-users" aria-hidden="true"></i>
                            4
                            Personas

                        </span>
                        <span   class="receta-info-dificultad">
                            <i class="fas fa-star" aria-hidden="true"></i>
                            <i class="fas fa-star" aria-hidden="true"></i>
                            <i class="far fa-star" aria-hidden="true"></i>

                            Dificultad

                        </span>
                        <span   class="receta-info-tiempo">
                            <i class="fa fa-clock-o" aria-hidden="true"></i>
                            600
                            min
                        </span>
                    </div>
                </article>	
            </div>
                `
            })
        }
    }
}

//Devuelve las recetas cuyo autor sea, o contenga, el texto {AUTOR} en el campo autor
function getRecetaFiltro({autor, nombre, ingrediente, etiqueta, dificultad, numeroReg, cantidadReg}){
    //Recogemos la url desde el método de los helpers, pasándole por parámetro lo mismo que le hemos pasado a la función
    const url = prepararFiltro({autor, nombre, ingrediente, etiqueta, dificultad, numeroReg, cantidadReg});

    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', url , true);
        xhr.responseType = 'json';
        xhr.onload = () => {
            let recetas = xhr.response;

            resolve(recetas);
        };
        xhr.send();
    });

}


/***********************************************************
                        PETICIONES POST
***********************************************************/

// Hacer el login del usuario
function hacerLogin(form){  
    
    let url = 'api/usuarios/login',  
        fdata = new FormData(form),
        xhr = new XMLHttpRequest(); 

        xhr.open('POST',url,true); 
        console.log("aqui")
        xhr.onload=function(){

            let user = JSON.parse(xhr.responseText);  
            console.log(user);

            if(user.RESULTADO === 'OK'){  

                sessionStorage['usuario'] = xhr.responseText;
                console.log(user.ULTIMO_ACCESO);
                mostrarMensajeLogin(user.ULTIMO_ACCESO);
            }else{
                mostrarMensajeError();
            }
        };
        xhr.send(fdata);
    return false;  
}

// Hacer el logout del usuario mandando la cabecera de Auth
function hacerLogout(){
    let u = getUserData();
    sessionStorage.clear();

    const tokenAuth = construyeToken(u.LOGIN);
    
    return fetch('api/usuarios/logout', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": tokenAuth,
        }
    }).then(res => res.json());
}

// Dar de alta un nuevo usuario
function darAltaUsuario(evt) {
    evt.preventDefault();

    let url = 'api/usuarios/registro',
        xhr = new XMLHttpRequest(),
        frm = evt.currentTarget, // formulario
        fd = new FormData(frm);

    xhr.open('POST', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        let r = xhr.response;

        if (r.CODIGO === 201) {
            sessionStorage['usuario'] = JSON.stringify(r);
            mostrarMensajeRegistro();
        }else{
            mostrarMensajeError();
        }
    }
    xhr.send(fd);
}
