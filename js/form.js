
var recetas_actuales = 0;
var i=0;
var primeroBusca = false;
// Obtener referencia al formulario
const form = document.getElementById('busquedaForm');

// Adjuntar un controlador de eventos para el evento 'submit'
form.addEventListener('submit', async function(event) {
    // Prevenir el comportamiento predeterminado del formulario (recargar la página)
    event.preventDefault();
    resetearBusquedas();
    // Llamar a la función realizaBusqueda de forma asíncrona
    let recetas= await realizaBusqueda();
   muestraBusqueda(recetas);
   numBusquedas(i);
});

async function realizaBusqueda() { //TODO: revisar contiene, ingrediente y etiquetas. Recoger y buscar la etiqueta por la url y actualizar paginacion de busqueda
    const autor = document.querySelector('input[name="autor"]').value;
    const nombre = document.querySelector('input[name="nombre"]').value;
    const elaboracion = document.querySelector('input[name="elaboracion"]').value;
    const ingredientes = document.querySelector('input[name="ingredientes"]').value;
    const etiquetas = document.querySelector('input[name="etiquetas"]').value;
    const dificultad = document.querySelector('select[name="dificultad"]').value;

    const recetas = await getRecetaFiltro({ autor, nombre, elaboracion, ingredientes, etiquetas, dificultad});
    let numFilas = recetas.FILAS.length;
    recetas_actuales=numFilas;
    return recetas;
}

async function muestraBusqueda(recetas){
    const contenedor = document.getElementById('contenedor-articulos');
    
    // Crear un array para almacenar las recetas finales
    const recetasFinales = [];

    // Bucle para copiar las recetas.FILAS[] a partir de i
    for (let j = i; j < recetas.FILAS.length; j++) {
        recetasFinales.push(recetas.FILAS[j]);
    }

    let limitador = 2;

    recetasFinales.forEach(async receta => {
        if(limitador>0){
           // Crear un nuevo elemento div para cada receta
           const recetaDiv = document.createElement('div');
            
           // Crear el contenido HTML de la receta utilizando los datos
           const contenidoReceta = `
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

           // Establecer el contenido HTML en el elemento div
           recetaDiv.innerHTML = contenidoReceta;
           
           // Agregar el elemento div al contenedor
           contenedor.appendChild(recetaDiv);
           limitador--;
        }
    });
    if(recetasFinales.length>=2 && !primeroBusca){
        i=2;
    }else if(recetasFinales.length<2 && primeroBusca){
        i += recetasFinales.length;
    }else if(recetasFinales.length>=2 && primeroBusca){
        i += 2;
    }else{
        i = recetasFinales.length;
    }
    primeroBusca = true;
}

function numBusquedas(filas){
    let url = 'api/recetas',
    xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        let html = '';
        html += `
        <article class="index.html">
        <h3> Mostrando ${filas} de ${recetas_actuales} recetas.</h3>
        </article>
        `
        document.querySelector('#paginacion').innerHTML = html;
    }
    xhr.send();
}
function resetearBusquedas(){
    const contenedor = document.getElementById('contenedor-articulos');
    contenedor.innerHTML="";
    i = 0;
}
async function mostrarMasBusquedas(){
    if(primeroBusca && i<recetas_actuales){
        let recetasBuscadas = recetas_actuales;
        let recetas= await realizaBusqueda();
        muestraBusqueda(recetas);
        numBusquedas(i);
    }
}