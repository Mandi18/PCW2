// Variable para almacenar el intervalo del temporizador
let intervalo;
const ANCHO_CANVAS = 360;
let nDivs = 5;
let jugadasRealizadas = 0; 
let piezasCorrectas = 0;  
let estadoInicialPiezas = [];
let victoria = 0;
let n=0;
let cargada = 0;

const perder = document.querySelector('.terminar');
const modalVictoria = document.querySelector('.modalVictoria');
const modalDerrota = document.querySelector('.modalDerrota');

perder.addEventListener('click', (e)=>{
    e.preventDefault();
    modalDerrota.classList.add('modal--show');
});

document.addEventListener("DOMContentLoaded", function() {
    // Borrar el sessionStorage al cargar la página
    if(sessionStorage.length===1 || sessionStorage.length===2 || sessionStorage.getItem('n')==1)
        sessionStorage.clear();
    console.log(sessionStorage);

    if(sessionStorage.length>0){
        //Cargo la dificultad del sesion storage
        var dificultadConcatenada = sessionStorage.getItem('dificultad') + "x" + sessionStorage.getItem('dificultad');
        var radioBtnDificultad = document.getElementById(dificultadConcatenada);
        if(radioBtnDificultad!=null){
            radioBtnDificultad.checked = true;
        }else{
            sessionStorage.setItem('dificultad',5);
            radioBtnDificultad = '5x5';
            radioBtnDificultad.checked = true;
        }
        nDivs =  sessionStorage.getItem('dificultad');

        //Cargo las piezas jugadas del sesion storage
        var jugadas = sessionStorage.getItem('jugadas');
        if(jugadas!=null){
            jugadasRealizadas = jugadas ;
        }else{
            sessionStorage.setItem('jugadas',0);
            jugadas = sessionStorage.getItem('jugadas');
        }
        jugadasRealizadas = sessionStorage.getItem('jugadas');
        var divJugadas = document.getElementById('jugadasRealizadas');
        divJugadas.textContent = sessionStorage.getItem('jugadas');
        
         //Cargo las piezas correctas del sesion storage
         var correctas = sessionStorage.getItem('correctas');
         if(correctas!=null){
             piezasCorrectas = correctas ;
         }else{
             sessionStorage.setItem('correctas',0);
             correctas = sessionStorage.getItem('correctas');
         }
         piezasCorrectas = sessionStorage.getItem('correctas');
         var divCorrectas = document.getElementById('piezasCorrectas');
         divCorrectas.textContent = sessionStorage.getItem('correctas');

        // Obtener el tiempo de inicio guardado en sessionStorage
        const tiempoInicial = parseInt(sessionStorage.getItem('tiempo'));

        if (tiempoInicial) {
            // Obtener el tiempo actual del ordenador en milisegundos
            const tiempoActual = new Date().getTime();

            // Calcular la diferencia de tiempo en milisegundos
            const tiempoTranscurrido = tiempoActual - tiempoInicial;

            // Convertir la diferencia de tiempo a minutos y segundos
            let minutos = Math.floor(tiempoTranscurrido / (1000 * 60));
            let segundos = Math.floor((tiempoTranscurrido % (1000 * 60)) / 1000);

            // Formatear el tiempo en minutos y segundos
            let tiempoFormateado = `${minutos}m ${segundos}s`;

            // Mostrar el tiempo transcurrido en el elemento HTML
            document.getElementById('tiempoEmpleado').textContent = tiempoFormateado;
            
        } else {
            // Si no hay un tiempo inicial guardado, mostrar "0m 0s"
            document.getElementById('tiempoEmpleado').textContent = '0m 0s';
        }         
         var imagenCanvas = sessionStorage.getItem('imagen');
         if(imagenCanvas!=null){
            // Crear una nueva imagen
            var blob = dataURLtoBlob(imagenCanvas);
            var file = new File([blob], "image.png", { type: blob.type });
            mostrarImagenEnCanvas(file);
        }
            // Desactivar los radio buttons con nombre "option_grid"
            let radioButtonsGrid = document.querySelectorAll('input[type="radio"][name="option_grid"]');
            radioButtonsGrid.forEach(button => {
                button.disabled = true;
            });
            // Desactivar el botón "Cargar imagen"
            document.getElementById('loadImg').disabled = true; 
            var imgCargada=sessionStorage.getItem('cargada');
            if(imgCargada!= null){
                cargada=1;
            }else{
                cargada=0;
                sessionStorage.setItem('cargada',cargada);
            }
    }

    prepararCanvas();
    prepararEventosCanvas();
    setInterval(actualizarTiempoSinPartida, 1000);
});

// Función para actualizar el tiempo después de cargar la página
function actualizarTiempoSinPartida() {
    // Obtener el tiempo de inicio guardado en sessionStorage
    const tiempoInicial = parseInt(sessionStorage.getItem('tiempo'));
    if(victoria!==2){
        if (tiempoInicial) {
            // Obtener el tiempo actual del ordenador en milisegundos
            const tiempoActual = new Date().getTime();
    
            // Calcular la diferencia de tiempo en milisegundos
            const tiempoTranscurrido = tiempoActual - tiempoInicial;
    
            // Convertir la diferencia de tiempo a minutos y segundos
            let minutos = Math.floor(tiempoTranscurrido / (1000 * 60));
            let segundos = Math.floor((tiempoTranscurrido % (1000 * 60)) / 1000);
    
            // Formatear el tiempo en minutos y segundos
            let tiempoFormateado = `${minutos}m ${segundos}s`;
    
            // Mostrar el tiempo transcurrido en el elemento HTML
            document.getElementById('tiempoEmpleado').textContent = tiempoFormateado;
        } else {
            // Si no hay un tiempo inicial guardado, mostrar "0m 0s"
            document.getElementById('tiempoEmpleado').textContent = '0m 0s';
        }         
    }
    
}
// Función para actualizar el temporizador
function actualizarTiempo(tiempo) {
    const tiempoEmpleado = document.getElementById('tiempoEmpleado');
    tiempoEmpleado.textContent = tiempo;
}


// Función para iniciar el temporizador
function iniciarTemporizador() {
    let startTime = sessionStorage.getItem('tiempo'); // Obtener el tiempo de inicio guardado en sessionStorage

    if (!startTime) {
        // Si no hay un tiempo de inicio guardado, obtener el tiempo actual y guardarlo en sessionStorage
        startTime = new Date().getTime();
        sessionStorage.setItem('tiempo', startTime);
    } else {
        // Si ya hay un tiempo de inicio guardado, convertirlo a un objeto Date para su posterior uso
        startTime = parseInt(startTime);
    }

    // Desactivar el botón "Empezar"
    document.getElementById('playButton').disabled = true;

    // Desactivar los radio buttons con nombre "option_grid"
    let radioButtonsGrid = document.querySelectorAll('input[type="radio"][name="option_grid"]');
    radioButtonsGrid.forEach(button => {
        button.disabled = true;
    });

    // Desactivar el botón "Cargar imagen"
    document.getElementById('loadImg').disabled = true;

    // Desactivar la opción de cargar imagen al arrastrar
    let cv1 = document.getElementById('cv1');
    cv1.ondrop = null;

    // Desactivar la opción de cargar imagen al hacer clic en el canvas cv1
    cv1.onclick = null;

    // Actualizar el tiempo cada segundo
    intervalo = setInterval(function() {
        const currentTime = new Date().getTime(); // Obtener el tiempo actual en milisegundos
        const tiempoTranscurrido = currentTime - startTime; // Calcular el tiempo transcurrido en milisegundos

        let minutos = Math.floor(tiempoTranscurrido / (1000 * 60)); // Convertir milisegundos a minutos
        let segundos = Math.floor((tiempoTranscurrido % (1000 * 60)) / 1000); // Convertir milisegundos restantes a segundos

        // Formatear el tiempo en minutos y segundos
        let tiempoFormateado = `${minutos}m ${segundos}s`;

        // Actualizar el tiempo en el elemento HTML
        actualizarTiempo(tiempoFormateado);
    }, 1000);

    // Habilitar el botón "Terminar"
    document.getElementById('stopButton').disabled = false;

    // Detener el temporizador cuando se haga clic en el botón "Terminar"
    document.getElementById('stopButton').addEventListener('click', function() {
        clearInterval(intervalo);
        mostrarMensajeModal();
    });

    // Remover el evento click del botón "Empezar" para evitar múltiples temporizadores
    document.getElementById('playButton').removeEventListener('click', iniciarTemporizador);

    // Activar radio buttons
    let radioButtons = document.querySelectorAll('input[type="radio"][name="option_grid2"]');
    radioButtons.forEach(button => {
        button.disabled = false;
    });

    var canvas = document.getElementById('cv1');
    var dataURL = canvas.toDataURL();
    sessionStorage.setItem('imagen', dataURL);
}

function detenerTemporizador() {
    victoria = 2;
}
// Función para mostrar el mensaje modal y recargar la página después de cerrarlo
function mostrarMensajeModal() {
    // Obtener los valores de jugadas realizadas, piezas correctas y tiempo empleado
    let jugadasRealizadas = document.getElementById('jugadasRealizadas').textContent;
    let piezasCorrectas = document.getElementById('piezasCorrectas').textContent;
    let tiempoEmpleado = document.getElementById('tiempoEmpleado').textContent;
    if (victoria===0){
        // Mostrar el mensaje de derrota
        const modal = document.querySelector('.modalDerrota');
        modal.querySelector('.modal_jugadas').textContent = "Jugadas realizadas: " + jugadasRealizadas;
        modal.querySelector('.modal_correctas').textContent = "Piezas correctas: " + piezasCorrectas;
        modal.querySelector('.modal_tiempo').textContent = "Tiempo empleado: " + tiempoEmpleado;
        modal.classList.add('modal--show');
    }else{
        // Mostrar el mensaje de victoria
        const modal = document.querySelector('.modalVictoria');
        modal.querySelector('.modal_jugadas').textContent = "Jugadas realizadas: " + jugadasRealizadas;
        modal.querySelector('.modal_correctas').textContent = "Piezas correctas: " + piezasCorrectas;
        modal.querySelector('.modal_tiempo').textContent = "Tiempo empleado: " + tiempoEmpleado;
        modal.classList.add('modal--show');
    }
    detenerTemporizador();
}
function cerrarModal(){
        if(victoria===0){
            const modal = document.querySelector('.modalVictoria');
            modal.classList.remove('modal--show');
        }else{
            const modal = document.querySelector('.modalDerrota');
            modal.classList.remove('modal--show');
        }
        sessionStorage.clear();
        n++;
        sessionStorage.setItem("n",n);  
            // Recargar la página después de cerrar el mensaje modal
            window.location.reload();
}

function cerrarModalBienvenida(){
    const modal = document.getElementById('modalBienvenida');
    modal.classList.add('modal--hide');
}

// Asociar la función de inicio al botón "Empezar"
document.getElementById('playButton').addEventListener('click', iniciarTemporizador);

//Preparamos el canvas
function prepararCanvas() {
    let cv = document.querySelector('#cv1');

    cv.width = ANCHO_CANVAS;
    cv.height = cv.width;

    if(cargada===0){
        // DnD: Destino
        cv.ondragover = function( evt ) {
            evt.preventDefault();
        }

        cv.ondrop = function( evt ) {
            evt.preventDefault();

            // if( evt.dataTransfer.files.length > 0 ) {
            if( evt.dataTransfer.getData('text/plain') == '' ) {
                console.log("FICHERO EXTERNO");
                let fichero = evt.dataTransfer.files[0];

                mostrarImagenEnCanvas( fichero );
            }
            else {
                let idx = evt.dataTransfer.getData('text/plain'),
                    ctx = cv.getContext('2d'),
                    img;
                img = document.querySelector('[data-idx="' + idx + '"]');

                // Pintar la imagen
                let ancho, alto,
                    posX, posY;

                if( img.naturalWidth > img.naturalHeight ) {
                    ancho = cv.width;
                    posX = 0;
                    alto = img.naturalHeight * (cv.width / img.naturalWidth);
                    posY = (cv.height - alto) / 2;
                }
                else {
                    alto = cv.height;
                    posY = 0;
                    ancho = img.naturalWidth * (cv.height / img.naturalHeight);
                    posX = (cv.width - ancho) / 2;
                }
                cv.width = cv.width;
                ctx.beginPath();
                ctx.fillStyle ='#fff';
                ctx.fillRect(0,0,cv.width, cv.height);
                ctx.drawImage( img, posX, posY, ancho, alto);
            }
        }
    }

    cv2 = document.querySelector('#cv2'),
    cv2.width = cv.width;
    cv2.height = cv.height;

}
function mostrarImagenEnCanvas(fichero) {
    let cv = document.querySelector('#cv1'),
        ctx = cv.getContext('2d'),
        img = new Image();
    img.onload = function() {
        let cv2 = document.querySelector('#cv2'),
            ctx2 = cv2.getContext('2d');

        // Dibujar la imagen en cv1
        ctx.beginPath();
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, cv.width, cv.height);
        let ancho1, alto1,
            posX1, posY1;

        if (img.naturalWidth > img.naturalHeight) {
            ancho1 = cv.width;
            posX1 = 0;
            alto1 = img.naturalHeight * (cv.width / img.naturalWidth);
            posY1 = (cv.height - alto1) / 2;
        } else {
            alto1 = cv.height;
            posY1 = 0;
            ancho1 = img.naturalWidth * (cv.height / img.naturalHeight);
            posX1 = (cv.width - ancho1) / 2;
        }

        cv.width = cv.width;
        ctx.beginPath();
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.drawImage(img, posX1, posY1, ancho1, alto1);

        // Dibujar la imagen en cv2
        let ancho2, alto2,
            posX2, posY2;

        if (img.naturalWidth > img.naturalHeight) {
            ancho2 = cv2.width;
            posX2 = 0;
            alto2 = img.naturalHeight * (cv2.width / img.naturalWidth);
            posY2 = (cv2.height - alto2) / 2;
        } else {
            alto2 = cv2.height;
            posY2 = 0;
            ancho2 = img.naturalWidth * (cv2.height / img.naturalHeight);
            posX2 = (cv2.width - ancho2) / 2;
        }

        cv2.width = cv2.width;
        ctx2.beginPath();
        ctx2.fillStyle = '#fff';
        ctx2.fillRect(0, 0, cv2.width, cv2.height);
        ctx2.drawImage(img, posX2, posY2, ancho2, alto2);

        // Activar botón Empezar
        document.getElementById('playButton').disabled = false;
    };

    img.src = URL.createObjectURL(fichero);
}

//Cargamos la imagen
function cargarImagen() {
    let inp = document.createElement('input');

    inp.setAttribute('type', 'file');
    inp.onchange = function(evt) {
        let fichero = inp.files[0];

        if (fichero) {
            let img = document.createElement('img');
            img.onload = function() {
                let cv1 = document.querySelector('#cv1'),
                    ctx1 = cv1.getContext('2d'),
                    cv2 = document.querySelector('#cv2'),
                    ctx2 = cv2.getContext('2d'),
                    ancho, alto,
                    posX, posY,
                    factor;

                if (img.naturalWidth > img.naturalHeight) {
                    posX = 0;
                    ancho = cv1.width;
                    factor = cv1.width / img.naturalWidth;
                    alto = img.naturalHeight * factor;
                    posY = (cv1.height - alto) / 2;
                } else {
                    posY = 0;
                    alto = cv1.height;
                    factor = cv1.height / img.naturalHeight;
                    ancho = img.naturalWidth * factor;
                    posX = (cv1.width - ancho) / 2;
                }

                cv1.width = cv1.width;
                ctx1.drawImage(img, posX, posY, ancho, alto);

                // Activar botón Empezar
                document.getElementById('playButton').disabled = false;
            };

            img.src = URL.createObjectURL(fichero);
        }
    };

    inp.click();
}

// Función para actualizar nDivs según la opción seleccionada
function actualizarDivs(valor) {
    switch (valor) {
        case "5x5":
            nDivs = 5;
            break;
        case "7x7":
            nDivs = 7;
            break;
        case "10x10":
            nDivs = 10;
            break;
        default:
            nDivs = 5;
            break;
    }
    sessionStorage.setItem('dificultad',nDivs);
}

function prepararEventosCanvas() {
    let cv = document.querySelector('#cv1');
    let cv2 = document.querySelector('#cv2');
    let selecciona1= 0;
    if(cargada===0){
        cv.onclick = function(evt) {        
            cargarImagen();
            cargada=1;
            sessionStorage.setItem('cargada',cargada);
        }
   }
 // Variables para almacenar la pieza seleccionada anteriormente y su posición
    let piezaSeleccionada = null;
    let posicionPiezaSeleccionada = null;

// Variables para almacenar la última pieza pintada
//let ultimaPiezaPintada = null;

// cv2.onmousemove = function(evt) {
//     // Obtener las coordenadas del mouse dentro del canvas
//     let rect = cv2.getBoundingClientRect();
//     let x = evt.clientX - rect.left;
//     let y = evt.clientY - rect.top;

//     // Calcular la fila y la columna en la que se encuentra el mouse
//     let tam = cv2.width / nDivs;
//     let fila = Math.floor(y / tam);
//     let columna = Math.floor(x / tam);
//     let indice = fila * nDivs + columna;

//     // Obtener el contexto del canvas
//     let ctx = cv2.getContext('2d');

//     // Limpiar la última pieza pintada si hay una
//     if (ultimaPiezaPintada !== null) {
//         let [filaAnterior, columnaAnterior] = ultimaPiezaPintada;
//         pintarFondo(filaAnterior, columnaAnterior, 3); // Restaura el color de fondo original
//     }

//     // Pintar la nueva pieza
//     pintarFondo(fila, columna, 2); // Cambia el color de fondo a otro

//     // Actualizar la última pieza pintada
//     ultimaPiezaPintada = [fila, columna];
// };

    cv2.onclick = function(evt) {
        // Obtener las coordenadas del clic dentro del canvas
        let rect = cv2.getBoundingClientRect();
        let x = evt.clientX - rect.left;
        let y = evt.clientY - rect.top;

        // Calcular la fila y la columna en la que se hizo clic
        let tam = cv2.width / nDivs;
        let fila = Math.floor(y / tam);
        let columna = Math.floor(x / tam);
        let indice = fila * nDivs + columna;

        // Obtener las piezas actuales del sessionStorage
        let piezas = JSON.parse(sessionStorage['piezas']);

        // Si no hay ninguna pieza seleccionada anteriormente
        if (piezaSeleccionada === null) {
            pintarFondo(fila, columna,0);
            // Almacenar la pieza seleccionada y su posición
            piezaSeleccionada = piezas[indice];
            posicionPiezaSeleccionada = indice;
        } else {
            selecciona1 = 1;
            // Intercambiar las posiciones de las piezas
            let temp = piezas[posicionPiezaSeleccionada];
            piezas[posicionPiezaSeleccionada] = piezas[indice];
            piezas[indice] = temp;

            // Incrementar el contador de jugadas realizadas
            jugadasRealizadas++;
            document.getElementById('jugadasRealizadas').textContent = jugadasRealizadas;
            sessionStorage.setItem('jugadas',jugadasRealizadas);

            // Reiniciar la pieza seleccionada y su posición
            piezaSeleccionada = null;
            posicionPiezaSeleccionada = null;
            
            piezasCorrectas = 0;

            for (let i = 0; i < piezas.length; i++) {
                if (piezas[i] === estadoInicialPiezas[i]) {
                    piezasCorrectas++;
                }
            }
            document.getElementById('piezasCorrectas').textContent = piezasCorrectas;
            sessionStorage.setItem('correctas',piezasCorrectas);
        }

        if(piezasCorrectas === nDivs*nDivs){
            victoria=1;
            mostrarMensajeModal(jugadasRealizadas, piezasCorrectas, document.getElementById('tiempoEmpleado'));
        }

    // Actualizar el sessionStorage con las nuevas posiciones de las piezas
    sessionStorage['piezas'] = JSON.stringify(piezas);

    // Volver a pintar el canvas2 con las piezas actualizadas
   if(selecciona1 === 1){
    selecciona1=0;
    pintarPiezas();
   }
};

    // Desactivar botón Empezar
    document.getElementById('playButton').disabled = true;

    // Desactivar botón Terminar
    document.getElementById('stopButton').disabled = true;
            
    // Desactivar solo los radio buttons con name "option_grid2"
    let radioButtons = document.querySelectorAll('input[type="radio"][name="option_grid2"]');
    radioButtons.forEach(button => {
        button.disabled = true;
    });
                
    divisiones();
}

// Función para mostrar el canvas correspondiente
function mostrarCanvas(canvasId) {
    let canvas = document.getElementById(canvasId);
    if (canvas) {
        canvas.style.display = 'block';
    }
}

// Función para ocultar el canvas correspondiente
function ocultarCanvas(canvasId) {
    let canvas = document.getElementById(canvasId);
    if (canvas) {
        canvas.style.display = 'none';
    }
}

// Función para mostrar el canvas de la imagen y ocultar el de puzzle
function mostrarCanvasImagen() {
    mostrarCanvas('cv1');
    ocultarCanvas('cv2');
}

// Función para mostrar el canvas de puzzle y ocultar el de imagen
function mostrarCanvasPuzzle() {
    mostrarCanvas('cv2');
    ocultarCanvas('cv1');
}
function divisiones() {
    console.log("Se divide en:", nDivs);

    for( j = 0; j < nDivs * nDivs; j++)
        estadoInicialPiezas.push( j );

    let cv  = document.querySelector('#cv2'),
        ctx = cv.getContext('2d'),
        i, ancho = cv.width / nDivs;

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#a00';
    for( i = 1; i < nDivs; i++ ) {
        // divisiones verticales
        ctx.moveTo( i * ancho, 0);
        ctx.lineTo(i * ancho, cv.height );
        // divisiones horizontales
        ctx.moveTo(0, i * ancho);
        ctx.lineTo( cv.width, i * ancho);
    }
    ctx.stroke();
}

function mezclarPiezas() {
    let piezas = [],
        i, j, aux;

    for( i = 0; i < nDivs * nDivs; i++)
        piezas.push( i );

    // mezclar piezas
    piezas.forEach( function(pieza, idx) {
        j = Math.floor( Math.random() * (nDivs * nDivs) );
        aux = pieza;
        piezas[ idx ] = piezas[ j ];
        piezas[j] = aux;
    });

    sessionStorage['piezas'] = JSON.stringify( piezas );
}

function pintarPiezas() {    
    let piezas = JSON.parse(sessionStorage['piezas']),
        cv1 = document.querySelector('#cv1'),
        ctx1 = cv1.getContext('2d'),
        cv2 = document.querySelector('#cv2'),
        ctx2 = cv2.getContext('2d'),
        tam = cv1.width / nDivs; // Utilizar el valor actualizado de nDivs
console.log(piezas);
    let i =0;
    let piezasInicial = [];
    for( j = 0; j < nDivs * nDivs; j++)
        piezasInicial.push( j );
    // Obtener la imagen del canvas cv1
    let imgData = cv1.toDataURL();

    // Crear una imagen temporal
    let imgTemp = new Image();
    imgTemp.onload = function() {
        // Limpiar el canvas antes de dibujar
        cv2.width = cv2.width;

        piezas.forEach(function(pieza, idx) {
            let fila, col, // Posición en el vector de piezas
                fila2, col2;
            fila = Math.floor(idx / nDivs);
            col = idx % nDivs;

            fila2 = Math.floor(pieza / nDivs);
            col2 = pieza % nDivs;
            ctx2.drawImage(imgTemp, col2 * tam, fila2 * tam, tam, tam, col * tam, fila * tam, tam, tam);
                if (pieza === estadoInicialPiezas[i]) {
                    pintarFondo(fila, col,1);
                }

            divisiones();
            i++;
        });
    };
    // Establecer la fuente de la imagen temporal
    imgTemp.src = imgData;
}


function ejecutarPuzzle() {
    mostrarCanvasPuzzle();
    if (!sessionStorage['piezasMezcladas']) {
    mezclarPiezas();
    sessionStorage.setItem('piezasMezcladas', 'true');
}
    pintarPiezas();

}
// Función para convertir una URL de datos en un objeto Blob
function dataURLtoBlob(dataURL) {
    var arr = dataURL.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}
function pintarFondo( fila, col, color ) {
        let cv2 = document.querySelector('#cv2'),
        ctx2 = cv2.getContext('2d'),
        ancho = cv2.width / nDivs,
        imgData;

    imgData = ctx2.getImageData(col * ancho, fila * ancho, ancho, ancho);
    let pixel;
    for(let i = 0; i < imgData.height; i++ ){
        for( let j = 0; j < imgData.height; j++) {
            if(color === 1){
                pixel = (i * imgData.width + j) * 4;
                imgData.data[pixel] = 0; // rojo
                //imgData.data[pixel + 1] = 0; // verde
                imgData.data[pixel + 2] = 0; // azul
                //imgData.data[pixel + 3] = 0; // alpha
    
            }else if( color === 0){
                pixel = (i * imgData.width + j) * 4;
                imgData.data[pixel] = 0; // rojo
                imgData.data[pixel + 1] = 0; // verde
                //imgData.data[pixel + 2] = 0; // azul
                //imgData.data[pixel + 3] = 0; // alpha
            }
            // else if(color === 2){
            //     pixel = (i * imgData.width + j) * 4;
            //     //imgData.data[pixel] = 0; // rojo
            //     imgData.data[pixel + 1] = 0; // verde
            //     imgData.data[pixel + 2] = 0; // azul
            //     //imgData.data[pixel + 3] = 0; // alpha
            // }
        }
    }

    ctx2.putImageData( imgData, col * ancho, fila * ancho);

}