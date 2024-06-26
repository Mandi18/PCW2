'use strict';

/***********************************************************
                        VARIABLES
***********************************************************/
var maxRecetas = 0;
var recetas_actuales = 0;
var numFoto = 1;

/***********************************************************
                        PETICIONES GET
***********************************************************/

//Esta peticición recoge el formulario del html para poder habilitarlo cuando el usuario está logueado
function getFormComentario() {
    const url = 'formulario.html';
    fetch(url)
        .then(res => res.text())
        .then(data => {
            document.querySelector('div.receta-com').innerHTML = data;
        });
}

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
//Devuelve las recetas
function getRecetasTotales(){
    const url = 'api/recetas';
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = () => {
            let recetas = xhr.response;
            resolve(recetas.FILAS);
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

//Devuelve las fotos de la receta por ID
function getRecetaEtiquetasXid(id){
    const url = `api/recetas/${id}/etiquetas`;
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = () => {
            let etiquetas = xhr.response;

            resolve(etiquetas.FILAS);
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
            <li><a class="sinhover" href="buscar.html?e=${etiquetas.nombre}">${etiquetas.nombre}</a></li>
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
function getRecetaComentarios(){
    var params = new URLSearchParams(window.location.search);
    var id = parseInt(params.get('id'));

    let url = `api/recetas/${id}/comentarios`,
    xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function(){
        let respuesta = xhr.response;
        let html = '';
        respuesta.FILAS.forEach(function(comentarios){
            html += `
            <h4>${comentarios.titulo}</h4>
            <p class="texto-com">${comentarios.texto}</p>
            <div class="receta-comentario-autor-contenedor">
                <div class="receta-comentario-fecha">
                    <p><time datetime="2024-01-26 11:36">${comentarios.fechaHora}</time></p>
                </div>
                <div class="receta-comentario-autor">
                    <p>Por: <span>${comentarios.login}</span></p>
                </div>
            </div>
            `;
        });
        document.querySelector('#receta-comentario').innerHTML = html;
    }
    xhr.send();
}

//Devuelve las recetas cuyo autor sea, o contenga, el texto {AUTOR} en el campo autor
function getRecetaFiltro({autor, nombre, elaboracion, ingredientes, etiquetas, dificultad}){
    //Recogemos la url desde el método de los helpers, pasándole por parámetro lo mismo que le hemos pasado a la función

    const url = prepararFiltro({autor, nombre, elaboracion, ingredientes, etiquetas, dificultad});

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
        xhr.onload=function(){

            let user = JSON.parse(xhr.responseText);  

            if(user.RESULTADO === 'OK'){  
                sessionStorage['usuario'] = xhr.responseText;
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

//Publicar un comentario
function postComentario(evt) {
    var params=new URLSearchParams(window.location.search);
    var id=parseInt(params.get('id'));
    evt.preventDefault();
    let usu = JSON.parse(sessionStorage['usuario']);

    let url = `api/recetas/${id}/comentarios`,
        xhr = new XMLHttpRequest(),
        frm = evt.currentTarget,
        fd = new FormData(frm);

        let title=frm.querySelector('input[type="text"]').value;
        let comment=frm.querySelector('textarea').value;
        frm.reset(); 

        if(usu){
            let auth = usu.LOGIN + ':' + usu.TOKEN;
            xhr.open('POST', url, true);
            xhr.responseType = 'json';
            
            xhr.onload = function(){
                let r = xhr.response;

                if (r.CODIGO === 201) {
                    crearModalComentario(id);
                    document.querySelector('#publicarcom').reset();
                }
            }
            fd.append('titulo', title);
            fd.append('texto', comment);
            xhr.setRequestHeader('Authorization', auth);
            xhr.send(fd);
        }
}