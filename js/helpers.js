'use strict'

/*******************************************************
                        CÓDIGO
*******************************************************/
window.onload = function(){
    if(sessionStorage['usuario']){ //está logueado
        var navegacion = document.getElementById("nave");
        let html = `
        <li><div class="elemento-menu" ><a class="active" href="index.html"><i class="fas fa-home"></i><span>Inicio</span></a></div></li>
        <li><div class="elemento-menu" ><a  href="buscar.html"><i class="fas fa-search"></i><span>Buscar</span></a></div></li>
        <li><div class="elemento-menu" ><a  href="nueva.html"><i class="fas fa-plus"></i><span>Nueva</span></a></div></li>
        <li><div class="elemento-menu" ><a  href="index.html" onclick="hacerLogout(['usuario'])"><i class="fas fa-sign-out-alt"></i><span>Logout</span></a></div></li>          
        `;
        navegacion.innerHTML = html;
    }else{
        var navegacion = document.getElementById("nave");
        let html = `
        <li><div class="elemento-menu" ><a class="active" href="index.html"><i class="fas fa-home"></i><span>Inicio</span></a></div></li>
        <li><div class="elemento-menu" ><a  href="buscar.html"><i class="fas fa-search"></i><span>Buscar</span></a></div></li>
        <li><div class="elemento-menu" ><a  href="login.html"><i class="fas fa-sign-in-alt"></i><span>Login</span></a></div></li>
        <li><div class="elemento-menu" ><a  href="registro.html"><i class="fas fa-user-plus"></i><span>Registro</span></a></div></li>
        `;
        navegacion.innerHTML = html;
    }

    if(sessionStorage['usuario'] == null){
        if(window.location.href === "http://localhost/pcw/PCW2/nueva.html"){
            window.location.replace("index.html");
        }
    }else{
        if(window.location.href === "http://localhost/pcw/PCW2/registro.html" || window.location.href === "http://localhost/pcw/PCW2/login.html"){
            window.location.replace("index.html");
        }
    }
}

function construyeToken(usuario){
    // La línea siguiente genera un token cuando el login da CÓDIGO 200
    const token = sessionStorage.getItem('token');
    let tokenAuth = `${usuario}:${token}`;

    return tokenAuth;
}

function getUserData() {
    const session = sessionStorage.getItem('usuario');
    const obj = JSON.parse(session);
    return obj;
}

function prepararFiltro({autor, nombre, elaboracion, ingrediente, etiqueta, dificultad, numeroReg, cantidadReg}){

    if(numeroReg !== undefined && cantidadReg !== undefined){
        numeroReg = Number(numeroReg);
        cantidadReg = Number(cantidadReg);
    }
    let urlPeticion = 'api/recetas';
    let existeParametro = false;
    
    if(autor){
        if(!existeParametro){
            urlPeticion += `?a=${autor}`;
            existeParametro = true;
        }else{
            urlPeticion += `&a=${autor}`;
        }
    }

    //TODO: Revisar si esto está bien hecho
    if(!existeParametro){
        if((nombre != null && nombre != '') && (elaboracion != null && elaboracion != '')){
            urlPeticion += `?t=${nombre},${elaboracion}`;
            existeParametro = true;
        }else if(elaboracion != null && elaboracion != ''){
            urlPeticion += `?t=${elaboracion}`;
            existeParametro = true;
        }else if(nombre != null && nombre != ''){
            urlPeticion += `?t=${nombre}`;
            existeParametro = true;
        }
    }else{
        if((nombre != null && nombre != '') && (elaboracion != null && elaboracion != '')){
            urlPeticion += `&t=${nombre},${elaboracion}`;
        }else if(elaboracion != null && elaboracion != ''){
            urlPeticion += `&t=${elaboracion}`;
        }else if(nombre != null && nombre != ''){
            urlPeticion += `&t=${nombre}`;
        }
    }

    if(ingrediente){
        if(!existeParametro){
            urlPeticion += `?i=${ingrediente}`;
            existeParametro = true;
        }else{
            urlPeticion += `&i=${ingrediente}`;
        }
    }

    if(etiqueta){
        if(!existeParametro){
            urlPeticion += `?e=${etiqueta}`;
            existeParametro = true;
        }else{
            urlPeticion += `&e=${etiqueta}`;
        }
    }

    if(dificultad){
        if(!existeParametro){
            urlPeticion += `?d=${dificultad}`;
            existeParametro = true;
        }else{
            urlPeticion += `&d=${dificultad}`;
        }
    }

    if(numeroReg !== undefined && cantidadReg !== undefined){
        if(!existeParametro){
            urlPeticion += `?reg=${numeroReg}&cant=${cantidadReg}`;
            existeParametro = true; 
        }else{
            urlPeticion += `&reg=${numeroReg}&cant=${cantidadReg}`;
        }
    }

    //devolvemos el objeto que hemos ido creando por partes
    return urlPeticion;
}

function isLogged(){
    return sessionStorage.getItem('token') && sessionStorage.getItem('usuario');
}


/*******************************************************
                        MODALES
*******************************************************/
function mostrarMensajeLogin(fecha){ 
    let div = document.createElement("div");
    var html;

    div.id = 'mensaje-modal';
    div.style.position = 'fixed'; // o 'absolute' dependiendo de tu preferencia
    div.style.top = '50%';
    div.style.left = '50%';
    div.style.transform = 'translate(-50%, -50%)';
    div.style.background = 'white';
    div.style.padding = '20px';
    div.style.border = '1px solid black';

    html = `<article>
        <h2>Ha iniciado sesión</h2>
        <p>Último acceso: `+fecha+`</p>
        <button onclick="window.location.href = 'index.html'">Aceptar</button>
        </article>`;

    div.innerHTML = html;

    document.body.appendChild(div);
}

function mostrarMensajeRegistro() {
    let div = document.createElement("div");
    var html;

    div.id = 'mensaje-modal';
    div.style.position = 'fixed'; // o 'absolute' dependiendo de tu preferencia
    div.style.top = '50%';
    div.style.left = '50%';
    div.style.transform = 'translate(-50%, -50%)';
    div.style.background = 'white';
    div.style.padding = '20px';
    div.style.border = '1px solid black';

    html = `<article>
        <h2>Se ha registrado correctamente</h2>
        <button onclick="window.location.href = 'login.html'">Aceptar</button>
    </article>`;

    div.innerHTML = html;

    document.body.appendChild(div);
}

function mostrarMensajeError(){ 
    let div = document.createElement("div");
    var html;

    div.id = 'mensaje-modal';
    div.style.position = 'fixed'; // o 'absolute' dependiendo de tu preferencia
    div.style.top = '50%';
    div.style.left = '50%';
    div.style.transform = 'translate(-50%, -50%)';
    div.style.background = 'white';
    div.style.padding = '20px';
    div.style.border = '1px solid black';

    html = `<article>
        <h2>Error</h2>
        <p>Campos incorrectos</p>
        <button onclick="document.getElementById('mensaje-modal').remove();">Aceptar</button>
    </article>`;

    div.innerHTML = html;

    document.body.appendChild(div);
}