document.addEventListener('DOMContentLoaded', async () => {
    //OBTIENE EL ID DE LA URL DE LA PÁGINA
    const valores = location.search;
    const params = new URLSearchParams(valores);
    const idReceta = params.get('id');
    
    if(!idReceta){
        location.href = "index.html";
    }else{
        // HACEMOS LA PETICIÓN AL SERVIDOR PARA OBTENER LOS DATOS
        const respuesta = await getRecetaID(idReceta);
        const receta = respuesta.FILAS[0];

        if(!receta){
            location.href = "index.html";
        }else{

            // CONSTANTES QUE VAMOS A NECESITAR PARA LAS FOTOS, ETIQUETAS, INGREDIENTES Y COMENTARIOS
            const respFotos = await getRecetaFotos(idReceta);
            const fotos = respFotos.FILAS;

            const section = document.querySelector('section');
            section.innerHTML += `
            <div class="page-title-container">
                <h2 class="page-title">Receta número ${receta.id}: ${receta.nombre}</h2>
            </div>

            <div id="contenedor6" class="contenedor6">
                <div class="receta-info-autor">
                    <div class="receta-autor">
                        <h2>Autor: <a href="buscar.html" class="memato"><span>${receta.autor}</span></a></h2>
                    </div>
                    <div class="receta-fecha">
                        <h2>Fecha de creaci&oacute;n: <span>${receta.fechaCreacion}</span></h2>
                    </div>
                    <div class="receta-personas">
                        <h2>Personas: <span> ${receta.personas} <i class="fa fa-users" aria-hidden="true"></i></span></h2>
                    </div>
                    <div class="receta-dificultad">
                        <h2>Dificultad: ${receta.dificultad}<span>                                
                            <i class="fas fa-star" aria-hidden="true"></i>
                        </span></h2>
                    </div>
                    <div class="receta-tiempo">
                        <h2>Tiempo de elaboracion: <span> ${receta.tiempo} min </span></h2>
                    </div>
                </div>
            </div>

            <div id="contenedor6" class="contenedor6">
                <div class="receta-top-container">
                    <div class="receta-images-contenedor">
                        <h3>FOTOS</h3>
                        <div id="uwu"></div>
                        <div class="receta-images-desplazamiento-contenedor">
                            <button id="izquierda" onclick="moverIzquierda()"><i class="fas fa-angle-left"></i></button>
                            <div id="wa"></div>
                            <button id="derecha" onclick="moverDerecha()"><i class="fas fa-angle-right"></i></button>
                        </div>
                    </div>
                    <div class="receta-info-basica-contenedor">
                        <div class="receta-info-etiquetas">
                            <h3>Etiquetas</h3>
                            <ul>
                                <li><a href="buscar.html">Pasta</a></li>
                                <li><a href="buscar.html">Comida Italiana</a></li>        
                            </ul> 
                        </div>
                        <div class="receta-info-ingredientes">
                            <h3>Ingredientes</h3>
                            <ul>
                                <li>500 gramos de harina</li>
                                <li>200 militros de aciete</li>   
                                <li>queso para pizzas</li>       
                            </ul>
                            
                        </div>
                    </div>




                </div>
            </div>
            `;
            verFotos();
            //enQueFoto();
        }
    }
});

function crearReceta(){
    //CREAMOS LA PÁGINA DE LA RECETA
    const receta = document.querySelector('#contenedor6');
    receta.innerHTML += `
    <div class="receta-info-autor">
        <div class="receta-autor">
            <h2>Autor: <a href="buscar.html"><span>${receta.autor}</span></a></h2>
        </div>
        <div class="receta-fecha">
            <h2>Fecha de creaci&oacute;n: <span>${receta.fechaHora}</span></h2>
        </div>
        <div class="receta-personas">
            <h2>Personas: <span> ${receta.personas} <i class="fa fa-users" aria-hidden="true"></i></span></h2>
        </div>
        <div class="receta-dificultad">
            <h2>Dificultad: ${receta.dificultad}<span>                                
                <i class="fas fa-star" aria-hidden="true"></i>
            </span></h2>
        </div>
        <div class="receta-tiempo">
            <h2>Tiempo de elaboracion: <span> ${receta.tiempo} min </span></h2>
        </div>
    </div>
    `
}