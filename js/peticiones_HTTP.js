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

// Devuelve toda la información de la receta
function getRecetas(){
    let url = 'api/recetas',
    xhr = new XMLHttpRequest();

    let cantidad = 6;

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
                        <a href="receta.html?id=${receta.id}"><h2 class="articles-title">${receta.nombre}</h2></a>
                        <span class="tooltiptext">${receta.nombre}</span>
                    </div><br>
                    <a href="receta.html"><img src="fotos/${receta.imagen}" alt="${receta.nombre}" class="img-receta"></a>

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
                </div>
                `;
            });
            numRecetas(numFilas.length);
            document.querySelector('#recetas').innerHTML = html;
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
