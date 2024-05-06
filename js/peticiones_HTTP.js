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
                        VARIABLES
***********************************************************/
var maxRecetas = 0;
var recetas_actuales = 0;
var numFoto = 1;


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

// Devuelve toda la información de la receta y la construye
function getRecetas(cantidad){
    let url = 'api/recetas',
    xhr = new XMLHttpRequest();
    recetas_actuales += cantidad;
    
    url += '?reg=0&cant='+ recetas_actuales;

    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function(){
        let r = xhr.response;

        if(r.RESULTADO == 'OK'){
            let html = '';
            let numFilas = r.FILAS;
            r.FILAS.forEach(function(receta) {
                html += `
                <article>
                    <div class="tooltip">
                        <a href="receta.html?id=${receta.id}"><h2 class="articles-title">${receta.nombre}</h2></a>
                        <span class="tooltiptext">${receta.nombre}</span>
                    </div><br>
                    <a href="receta.html?id=${receta.id}""><img src="fotos/${receta.imagen}" alt="${receta.nombre}" class="img-receta"></a>

                    <div class="receta-info">
                        <span class="receta-info-personas">
                        Personas: ${receta.personas} 
                        <i class="fa fa-users" aria-hidden="true"></i>
                        </span>
                        <span class="receta-info-dificultad">
                        Dificultad: ${receta.dificultad}
                            <i class="fas fa-star" aria-hidden="true"></i>
                        </span>
                        <span class="receta-info-tiempo">
                        Tiempo: ${receta.tiempo} min
                            <i class="fa fa-clock-o" aria-hidden="true"></i>
                        </span>
                    </div>
                </article>
                `;
            });
            numRecetas(numFilas.length);
            document.querySelector('#contenedor-articulos').innerHTML = html;
        }
    }
    xhr.send();
}

function maximoRecetas(){
    let url = 'api/recetas',
    xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        let r = xhr.response;
        maxRecetas += r.FILAS.length;
    }
    xhr.send();
}

function numRecetas(filas){
    let url = 'api/recetas',
    xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        let html = '';
        html += `
        <article class="index.html">
        <h3> Mostrando ${filas} de ${maxRecetas} recetas.</h3>
        </article>
        `
        document.querySelector('#paginacion').innerHTML = html;
    }
    xhr.send();
}

function mostrarMas(mas){
    getRecetas(mas);
}

//Devuelve una receta por su ID
function getRecetaID(id){
    const url = `api/recetas/${id}`;
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = () => {
            let recetas = xhr.response;
            resolve(recetas);
        };
        xhr.send();
    });
}

//Devuelve las fotos de la receta por ID
function getRecetaFotos(id){
    const url = `api/recetas/${id}/fotos`;
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = () => {
            let fotos = xhr.response;
            resolve(fotos);
        }
        xhr.send();
    });
}

//Busca las fotos para el carrusel
function verFotos(){
    var params = new URLSearchParams(window.location.search);
    var id = parseInt(params.get('id'));

    let url = `api/recetas/${id}/fotos`,
    xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function(){
        let fotos = xhr.response;
        if(numFoto == fotos.FILAS.length){
            numFoto = 0;
        }else if(numFoto == -1){
            numFoto = fotos.FILAS.length-1;
        }
        let img = fotos.FILAS[numFoto];
        let html= `
        <img src="fotos/${img.archivo}" alt="${img.id}"  class="img-receta2" >
        <p>${img.descripcion}</p>
        `;
        document.querySelector('#uwu').innerHTML = html;
    }
    xhr.send();
}

function moverIzquierda(){
    numFoto+= -1;
    verFotos();
    enQueFoto();
}

function moverDerecha(){
    numFoto += 1;
    verFotos();
    enQueFoto();
}

//Muestra la posición de la foto donde estoy
function enQueFoto(){
    var params = new URLSearchParams(window.location.search);
    var id = parseInt(params.get('id'));

    let url = `api/recetas/${id}/fotos`,
    xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function(){
        let fotos = xhr.response;
        let maxFotos = fotos.FILAS.length;
        if(numFoto == 0){
            numFoto = maxFotos;
        }
        //El id de la función siguiente es para darle estilo a ese párrafo en concreto
        let html= `
        <p id="quierollorar">Foto ${numFoto} de ${maxFotos}</p>
        `;
        if(numFoto == maxFotos){
            numFoto = 0;
        }
        document.querySelector('#maxFotos').innerHTML = html;
    }
    xhr.send();
}

//Devuelve las etiquetas de la receta por ID
function getRecetaEtiquetas(){
    var params = new URLSearchParams(window.location.search);
    var id = parseInt(params.get('id'));

    let url = `api/recetas/${id}/etiquetas`,
    xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function(){
        let respuesta = xhr.response;
        let html = '';
        respuesta.FILAS.forEach(function(etiquetas){
            html += `
            <li>${etiquetas.nombre}</li>
            `;
        });
        document.querySelector('#etiquetas').innerHTML = html;
    }
    xhr.send();
}

//Devuelve los ingredientes de la receta por ID
function getRecetaIngredientes(){
    var params = new URLSearchParams(window.location.search);
    var id = parseInt(params.get('id'));

    let url = `api/recetas/${id}/ingredientes`,
    xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function(){
        let respuesta = xhr.response;
        let html = '';
        respuesta.FILAS.forEach(function(ingredientes){
            html += `
            <li>${ingredientes.texto}</li>
            `;
        });
        document.querySelector('#ingredientes').innerHTML = html;
    }
    xhr.send();
}

//Devuelve los comentarios de la receta por ID
function getRecetaComentarios(id){
    const url = `api/recetas/${id}/comentarios`;
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = () => {
            let comentarios = xhr.response;
            resolve(comentarios);
        }
        xhr.send();
    });
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
