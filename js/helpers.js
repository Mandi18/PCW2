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

function crearModalLogin(r) {
    let modal = creaPropiedadesModal();
    modal.innerHTML = `
        <h3>Usuario ${r.LOGIN} logueado correctamente</h3>
        <p>Última vez conectado: ${r.ULTIMO_ACCESO}</p>
        <button class="modal" onclick="cerrarModal({ redireccion:'index'})">Cerrar</button>
    `;

    document.body.appendChild(modal);
    modal.showModal();
}

function crearModalError(r) {
    let modal = creaPropiedadesModal();
    modal.innerHTML = `
        <h3>${r.DESCRIPCION}</h3>
        <button onclick="cerrarModal({ focus: 'login' })">Cerrar</button>
    `;

    document.body.appendChild(modal);
    modal.showModal();
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

// function isLogged(){
//     return sessionStorage.getItem('token') && sessionStorage.getItem('usuario');
// }

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
async function actualizaPaginacion(evt) {
    const valores = location.search;
    console.log("ActualizaPaginacion");
    const urlParams = new URLSearchParams(valores);
        const parametrosPeticion = {
            autor: urlParams.get('a')|| undefined,
            titulo: urlParams.get('t') || undefined,
            ingrediente: urlParams.get('i')|| undefined,
            etiqueta: urlParams.get('e') || undefined,
            dificultad: urlParams.get('d') || undefined,
            registrosPorPagina: parseInt(urlParams.get('reg')) || 6
        };

        const recetas = await getRecetaFiltro(parametrosPeticion);
        creaRecetas(recetas);
}

async function creaRecetas(recetas) {
    let divPubs = document.getElementById('recetas');

    const divContenedor = document.createElement('div');
    divContenedor.classList.add('contenedor-articulos');
    

    for (const rec of recetas.FILAS) {
        const recetaCompleta = await getRecetas(rec.id);
        const divArticulo = document.createElement('div');
        divArticulo.classList.add('articles-container');

        const receta = document.createElement('article');

        const divAdicional = document.createElement('div');
        divAdicional.classList.add('tooltip');

        const headerLink = document.createElement('a');
        headerLink.href = `receta.html?id=${rec.id}`;

        const header = document.createElement('h2');
        header.classList.add('articles-title');
        //header.title = recetaCompleta.FILAS[0].titulo;
        header.textContent = recetaCompleta.FILAS[0].nombre;

        const headerSpan = document.createElement('span');
        headerSpan.textContent = recetaCompleta.FILAS[0].nombre;
        headerSpan.classList.add('tooltiptext');

        headerLink.appendChild(header);
        headerLink.appendChild(headerSpan);
        divAdicional.appendChild(headerLink);

        const headerBr = document.createElement('br');

        const divAdicional2 = document.createElement('div');
        divAdicional2.classList.add('article-autor');

        const autorStatic = document.createElement('h3');
        autorStatic.textContent = "Autor: ";
        autorStatic.style.whiteSpace = "pre";

        const autorSpan = document.createElement('span');
        autorSpan.textContent = recetaCompleta.FILAS[0].autor; 

        const fecha = document.createElement('time');
        fecha.dateTime = recetaCompleta.FILAS[0].fechaCreacion;
        fecha.textContent = " " + recetaCompleta.FILAS[0].fechaCreacion;

        divAdicional2.appendChild(autorStatic);
        autorStatic.appendChild(autorSpan);
        autorStatic.appendChild(fecha);

        const imgLink = document.createElement('a');
        imgLink.href = `receta.html?id=${rec.id}`;

        const imgRec = document.createElement('img');
        imgRec.src = '/pcw/practica2/fotos/' + rec.imagen;
        imgRec.alt = 'Foto de la receta: ' + recetaCompleta.FILAS[0].nombre;

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
        personaSpan.appendChild(document.createTextNode(" " + recetaCompleta.FILAS[0].personas + " Personas "));

        const difSpan = document.createElement('span');
        difSpan.classList.add('receta-info-dificultad');

        const difIcon1 = document.createElement('i');
        const difIcon2 = document.createElement('i');
        const difIcon3 = document.createElement('i');

        if (recetaCompleta.FILAS[0].dificultad == 0) {
            difIcon1.classList.add('far', 'fa-star');
            difIcon1.setAttribute('aria-hidden', 'true');
            difIcon2.classList.add('far', 'fa-star');
            difIcon2.setAttribute('aria-hidden', 'true');
            difIcon3.classList.add('far', 'fa-star');
            difIcon3.setAttribute('aria-hidden', 'true');
        } else if (recetaCompleta.FILAS[0].dificultad == 1) {
            difIcon1.classList.add('fas', 'fa-star');
            difIcon1.setAttribute('aria-hidden', 'true');
            difIcon2.classList.add('far', 'fa-star');
            difIcon2.setAttribute('aria-hidden', 'true');
            difIcon3.classList.add('far', 'fa-star');
            difIcon3.setAttribute('aria-hidden', 'true');
        } else if (recetaCompleta.FILAS[0].dificultad == 2) {
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
        tiempoSpan.appendChild(document.createTextNode(recetaCompleta.FILAS[0].tiempo + " min"));

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
}