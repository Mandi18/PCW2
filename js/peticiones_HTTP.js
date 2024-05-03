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
function getDisponibilidadLogin(){
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
    const url = `api/recetas/${id}`;
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = () => {
            let recetas = xhr.response;
            resolve(recetas);
        };

        // if (isLogged()) {
        //     const usu = getUserData();
        //     const auth = usu.LOGIN + ':' + usu.TOKEN;
        //     xhr.setRequestHeader('Authorization', auth);
        // }
        xhr.send();
    });

}

// Devuelve todas las fotos de la receta con el ID indicado
function getFotosReceta(id) {
    const url = `api/recetas/${id}/fotos`;
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = () => {
            let fotos = xhr.response;
            resolve(fotos);
        };
        xhr.send();
    });
}

// Devuelve todos los ingredientes de la receta con el ID indicado
function getIngredientesReceta(id){
    const url = `api/recetas/${id}/ingredientes`;
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

// Devuelve todas las etiquetas de la receta con el ID indicado
function getEtiquetasReceta(id){
    const url = `api/recetas/${id}/etiquetas`;
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

// Devuelve todos los comentarios de la receta con el ID indicado
function getComentariosReceta(id){
    const url = `api/recetas/${id}/comentarios`;
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = () => {
            let comentarios = xhr.response;
            resolve(comentarios);
        };
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

function mostrarMensajeLogin(fecha){ 
    let div = document.createElement("div");
    var html;

    div.id = 'mensaje-modal';

    html = `<article>
        <h2>Ha iniciado sesion</h2>
        <p>Último acceso: `+fecha+`</p>
        <button onclick="window.location.href = 'index.html'">Aceptar</button>
        </article>`;

    div.innerHTML = html;

    document.body.appendChild(div);
}

function mostrarMensajeError(){ 
    let div = document.createElement("div");
    var html;

    div.id = 'mensaje-modal';

    html = `<article>
        <h2>Login incorrecto</h2>
        <p>Usuario o contraseña no validos</p>
        <button onclick="document.getElementById('mensaje-modal').remove();">Aceptar</button>
    </article>`;

    div.innerHTML = html;

    document.body.appendChild(div);
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
function darAltaUsuario(){
    
}
