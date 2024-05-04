'use strict'

/*******************************************************
                        CÓDIGO
*******************************************************/
window.onload = function(){
    if(sessionStorage['usuario']){ //está logueado
        console.log("holi");
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

function prepararFiltro({autor, nombre, ingrediente, etiqueta, dificultad, numeroReg, cantidadReg}){

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

    //TODO: falta el campo de elaboracion
    if(nombre){
        if(!existeParametro){
            urlPeticion += `?t=${nombre}`;
            existeParametro = true;
        }else{
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

async function actualizaPaginacion(paginasActuales, recetasTotales) { //Esto no está funcionando bien, hay que hacerlo como botones en el index.html que al darle ejecute el código y actualice los valores y cree las nuevas recetas TODO: REWORK
    paginasActualizadas = paginasActuales;
    let divPag = document.getElementsByClassName('paginacion')[0];
    let paginasTotales = recetasTotales.FILAS.length;
    const divPaginacion = document.createElement('div');

    const paginacion = document.createElement('h2');
    paginacion.textContent = paginasActuales + " de " + paginasTotales;

    const enlace = document.createElement('a');
    const iconPLus = document.createElement('i');
    iconPLus.classList.add('fas', 'fa-plus');
    iconPLus.textContent = " Más Recetas";

    if (paginasActualizadas < paginasTotales) {
        enlace.addEventListener('click', async function(event) {
            event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace
            const recetasCompletas = await ordenaRecetas(recetasTotales);
            const recetasActualizar = [];

            for (let i = paginasTotales - paginasActuales; i < recetasCompletas.length; i++){
                recetasActualizar.push(recetasCompletas[i]);
            }
            console.log(paginasActualizadas);
            paginasActualizadas = calculaPaginas(recetasActualizar.length,paginasActualizadas);
            console.log(paginasActualizadas);
            await ActualizaRecetas(recetasActualizar); // Llamar a creaRecetas sin recargar la página
        });
           } else {
        enlace.style.pointerEvents = "none";
    }

    enlace.appendChild(iconPLus);
    divPaginacion.appendChild(paginacion);
    divPaginacion.appendChild(enlace);
    divPag.appendChild(divPaginacion);
}
function calculaPaginas( recetasNuevas,recetasTotales){
    recetasTotales += recetasNuevas;
    return recetasTotales;
}
async function ordenaRecetas(recetas){
    const recetasCompletas = [];
    for (const rec of recetas.FILAS) {
        const recetaCompleta = await getRecetas(rec.id);
        recetasCompletas.push({ receta: recetaCompleta.FILAS[0], fecha: recetaCompleta.FILAS[0].fechaCreacion });
    }
    recetasCompletas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    return recetasCompletas;
}

async function ActualizaRecetas(recetas) {
    let divPubs = document.getElementById('recetas');

    const divContenedor = document.createElement('div');
    divContenedor.classList.add('contenedor-articulos');
    
    const recetasCompletas = [];

    for (let i = 0; i < 2; i++) { //este i < 2 es el que controla cuantas recetas se muestran
        recetasCompletas.push(recetas[i]);
    }
    for (let i = 0; i < recetasCompletas.length; i++) {
        const divArticulo = document.createElement('div');
        divArticulo.classList.add('articles-container');

        const receta = document.createElement('article');

        const divAdicional = document.createElement('div');
        divAdicional.classList.add('tooltip');

        const headerLink = document.createElement('a');
        headerLink.href = `receta.html?id=${recetasCompletas[i].receta.id}`;

        const header = document.createElement('h2');
        header.classList.add('articles-title');
        header.title = recetasCompletas[i].receta.nombre;
        header.textContent = recetasCompletas[i].receta.nombre;

        headerLink.appendChild(header);
        divAdicional.appendChild(headerLink);

        const headerBr = document.createElement('br');

        const divAdicional2 = document.createElement('div');
        divAdicional2.classList.add('article-autor');

        const autorStatic = document.createElement('h3');
        autorStatic.textContent = "Autor: ";
        autorStatic.style.whiteSpace = "pre";

        const autorSpan = document.createElement('span');
        autorSpan.textContent = recetasCompletas[i].receta.autor; 

        const fecha = document.createElement('time');
        fecha.dateTime = recetasCompletas[i].receta.fechaCreacion;
        fecha.textContent = " " + recetasCompletas[i].receta.fechaCreacion;

        divAdicional2.appendChild(autorStatic);
        autorStatic.appendChild(autorSpan);
        autorStatic.appendChild(fecha);

        const imgLink = document.createElement('a');
        imgLink.href = `receta.html?id=${recetasCompletas[i].receta.id}`;

        const imgRec = document.createElement('img');
        imgRec.src = '/pcw/practica2/fotos/' + recetasCompletas[i].receta.imagen;
        imgRec.alt = 'Foto de la receta: ' + recetasCompletas[i].receta.nombre;

        imgLink.appendChild(imgRec);

        const divAdicional3 = document.createElement('div');
        divAdicional3.classList.add('receta-info');

        const personaSpan = document.createElement('span');
        personaSpan.classList.add('receta-info-personas');

        const personaIcon = document.createElement('i');
        personaIcon.classList.add('fas', 'fa-users');
        personaIcon.setAttribute('aria-hidden', 'true');
        personaSpan.style.whiteSpace = "pre";
        personaSpan.appendChild(personaIcon);
        personaSpan.appendChild(document.createTextNode(" " + recetasCompletas[i].receta.personas + " Personas "));

        const difSpan = document.createElement('span');
        difSpan.classList.add('receta-info-dificultad');

        const difIcon1 = document.createElement('i');
        const difIcon2 = document.createElement('i');
        const difIcon3 = document.createElement('i');

        if (recetasCompletas[i].receta.dificultad == 0) {
            difIcon1.classList.add('far', 'fa-star');
            difIcon1.setAttribute('aria-hidden', 'true');
            difIcon2.classList.add('far', 'fa-star');
            difIcon2.setAttribute('aria-hidden', 'true');
            difIcon3.classList.add('far', 'fa-star');
            difIcon3.setAttribute('aria-hidden', 'true');
        } else if (recetasCompletas[i].receta.dificultad == 1) {
            difIcon1.classList.add('fas', 'fa-star');
            difIcon1.setAttribute('aria-hidden', 'true');
            difIcon2.classList.add('far', 'fa-star');
            difIcon2.setAttribute('aria-hidden', 'true');
            difIcon3.classList.add('far', 'fa-star');
            difIcon3.setAttribute('aria-hidden', 'true');
        } else if (recetasCompletas[i].receta.dificultad == 2) {
            difIcon1.classList.add('fas', 'fa-star');
            difIcon1.setAttribute('aria-hidden', 'true');
            difIcon2.classList.add('fas', 'fa-star');
            difIcon2.setAttribute('aria-hidden', 'true');
            difIcon3.classList.add('far', 'fa-star');
            difIcon3.setAttribute('aria-hidden', 'true');
        } else {
            difIcon1.classList.add('fas', 'fa-star');
            difIcon1.setAttribute('aria-hidden', 'true');
            difIcon2.classList.add('fas', 'fa-star');
            difIcon2.setAttribute('aria-hidden', 'true');
            difIcon3.classList.add('fas', 'fa-star');
            difIcon3.setAttribute('aria-hidden', 'true');
        }

        difSpan.appendChild(difIcon1);
        difSpan.appendChild(difIcon2);
        difSpan.appendChild(difIcon3);
        difSpan.appendChild(document.createTextNode(" Dificultad"));

        const tiempoSpan = document.createElement('span');
        tiempoSpan.classList.add('receta-info-tiempo');

        const timepoIcon = document.createElement('i');
        timepoIcon.classList.add('fa', 'fa-clock-o');
        timepoIcon.setAttribute('aria-hidden', 'true');

        tiempoSpan.appendChild(timepoIcon);
        tiempoSpan.appendChild(document.createTextNode(recetasCompletas[i].receta.tiempo + " min"));

        divAdicional3.appendChild(difSpan);
        divAdicional3.appendChild(personaSpan);
        divAdicional3.appendChild(tiempoSpan);

        receta.appendChild(divAdicional);
        receta.appendChild(headerBr);
        receta.appendChild(divAdicional2);
        receta.appendChild(imgLink);
        receta.appendChild(divAdicional3);

        divArticulo.appendChild(receta);

        divContenedor.appendChild(divArticulo);
    }

    divPubs.appendChild(divContenedor);
    return recetasCompletas.length;
}

async function creaRecetas(recetas) {
    let divPubs = document.getElementById('recetas');

    const divContenedor = document.createElement('div');
    divContenedor.classList.add('contenedor-articulos');
    
    const recetasOrdenadas = await ordenaRecetas(recetas);
    const recetasCompletas = [];

    for (let i = 0; i < 2; i++) { //este i < 2 es el que controla cuantas recetas se muestran
        recetasCompletas.push(recetasOrdenadas[i]);
    }
    for (let i = 0; i < recetasCompletas.length; i++) {
        const divArticulo = document.createElement('div');
        divArticulo.classList.add('articles-container');

        const receta = document.createElement('article');

        const divAdicional = document.createElement('div');
        divAdicional.classList.add('tooltip');

        const headerLink = document.createElement('a');
        headerLink.href = `receta.html?id=${recetasCompletas[i].receta.id}`;

        const header = document.createElement('h2');
        header.classList.add('articles-title');
        header.title = recetasCompletas[i].receta.nombre;
        header.textContent = recetasCompletas[i].receta.nombre;

        headerLink.appendChild(header);
        divAdicional.appendChild(headerLink);

        const headerBr = document.createElement('br');

        const divAdicional2 = document.createElement('div');
        divAdicional2.classList.add('article-autor');

        const autorStatic = document.createElement('h3');
        autorStatic.textContent = "Autor: ";
        autorStatic.style.whiteSpace = "pre";

        const autorSpan = document.createElement('span');
        autorSpan.textContent = recetasCompletas[i].receta.autor; 

        const fecha = document.createElement('time');
        fecha.dateTime = recetasCompletas[i].receta.fechaCreacion;
        fecha.textContent = " " + recetasCompletas[i].receta.fechaCreacion;

        divAdicional2.appendChild(autorStatic);
        autorStatic.appendChild(autorSpan);
        autorStatic.appendChild(fecha);

        const imgLink = document.createElement('a');
        imgLink.href = `receta.html?id=${recetasCompletas[i].receta.id}`;

        const imgRec = document.createElement('img');
        imgRec.src = '/pcw/practica2/fotos/' + recetasCompletas[i].receta.imagen;
        imgRec.alt = 'Foto de la receta: ' + recetasCompletas[i].receta.nombre;

        imgLink.appendChild(imgRec);

        const divAdicional3 = document.createElement('div');
        divAdicional3.classList.add('receta-info');

        const personaSpan = document.createElement('span');
        personaSpan.classList.add('receta-info-personas');

        const personaIcon = document.createElement('i');
        personaIcon.classList.add('fas', 'fa-users');
        personaIcon.setAttribute('aria-hidden', 'true');
        personaSpan.style.whiteSpace = "pre";
        personaSpan.appendChild(personaIcon);
        personaSpan.appendChild(document.createTextNode(" " + recetasCompletas[i].receta.personas + " Personas "));

        const difSpan = document.createElement('span');
        difSpan.classList.add('receta-info-dificultad');

        const difIcon1 = document.createElement('i');
        const difIcon2 = document.createElement('i');
        const difIcon3 = document.createElement('i');

        if (recetasCompletas[i].receta.dificultad == 0) {
            difIcon1.classList.add('far', 'fa-star');
            difIcon1.setAttribute('aria-hidden', 'true');
            difIcon2.classList.add('far', 'fa-star');
            difIcon2.setAttribute('aria-hidden', 'true');
            difIcon3.classList.add('far', 'fa-star');
            difIcon3.setAttribute('aria-hidden', 'true');
        } else if (recetasCompletas[i].receta.dificultad == 1) {
            difIcon1.classList.add('fas', 'fa-star');
            difIcon1.setAttribute('aria-hidden', 'true');
            difIcon2.classList.add('far', 'fa-star');
            difIcon2.setAttribute('aria-hidden', 'true');
            difIcon3.classList.add('far', 'fa-star');
            difIcon3.setAttribute('aria-hidden', 'true');
        } else if (recetasCompletas[i].receta.dificultad == 2) {
            difIcon1.classList.add('fas', 'fa-star');
            difIcon1.setAttribute('aria-hidden', 'true');
            difIcon2.classList.add('fas', 'fa-star');
            difIcon2.setAttribute('aria-hidden', 'true');
            difIcon3.classList.add('far', 'fa-star');
            difIcon3.setAttribute('aria-hidden', 'true');
        } else {
            difIcon1.classList.add('fas', 'fa-star');
            difIcon1.setAttribute('aria-hidden', 'true');
            difIcon2.classList.add('fas', 'fa-star');
            difIcon2.setAttribute('aria-hidden', 'true');
            difIcon3.classList.add('fas', 'fa-star');
            difIcon3.setAttribute('aria-hidden', 'true');
        }

        difSpan.appendChild(difIcon1);
        difSpan.appendChild(difIcon2);
        difSpan.appendChild(difIcon3);
        difSpan.appendChild(document.createTextNode(" Dificultad"));

        const tiempoSpan = document.createElement('span');
        tiempoSpan.classList.add('receta-info-tiempo');

        const timepoIcon = document.createElement('i');
        timepoIcon.classList.add('fa', 'fa-clock-o');
        timepoIcon.setAttribute('aria-hidden', 'true');

        tiempoSpan.appendChild(timepoIcon);
        tiempoSpan.appendChild(document.createTextNode(recetasCompletas[i].receta.tiempo + " min"));

        divAdicional3.appendChild(difSpan);
        divAdicional3.appendChild(personaSpan);
        divAdicional3.appendChild(tiempoSpan);

        receta.appendChild(divAdicional);
        receta.appendChild(headerBr);
        receta.appendChild(divAdicional2);
        receta.appendChild(imgLink);
        receta.appendChild(divAdicional3);

        divArticulo.appendChild(receta);

        divContenedor.appendChild(divArticulo);
    }

    divPubs.appendChild(divContenedor);
    return recetasCompletas.length;
}



/*******************************************************
                        MODALES
*******************************************************/
function crearModalRegistro(r) {
    let modal = creaPropiedadesModal();
    modal.innerHTML = `
        <h3>Usuario ${r.LOGIN} registrado correctamente</h3>
        <button class="modal" onclick="cerrarModal({ redireccion:'login'})">Cerrar</button>
    `;

    document.body.appendChild(modal);
    modal.showModal();
}