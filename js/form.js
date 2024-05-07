// Obtener referencia al formulario
const form = document.getElementById('busquedaForm');

// Adjuntar un controlador de eventos para el evento 'submit'
form.addEventListener('submit', async function(event) {
    // Prevenir el comportamiento predeterminado del formulario (recargar la página)
    event.preventDefault();

    // Llamar a la función realizaBusqueda de forma asíncrona
    await realizaBusqueda();
});

async function realizaBusqueda() { //TODO: revisar contiene, ingrediente y etiquetas. Recoger y buscar la etiqueta por la url y actualizar paginacion de busqueda
    const autor = document.querySelector('input[name="autor"]').value;
    const nombre = document.querySelector('input[name="nombre"]').value;
    const elaboracion = document.querySelector('input[name="elaboracion"]').value;
    const ingredientes = document.querySelector('input[name="ingredientes"]').value;
    const etiquetas = document.querySelector('input[name="etiquetas"]').value;
    const dificultad = document.querySelector('select[name="dificultad"]').value;
    const recetas = await getRecetaFiltro({ autor, nombre, elaboracion, ingredientes, etiquetas, dificultad});
    const contenedor = document.getElementById('contenedor-articulos');

    recetas.FILAS.forEach(async receta => {
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
    });
}