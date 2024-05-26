// Variable para almacenar el intervalo del temporizador
let intervalo;
const ANCHO_CANVAS = 360;
let nDivs = 5;
let jugadasRealizadas = 0; 
let piezasCorrectas = 0;  
let estadoInicialPiezas = [];
let victoria = 0;
document.addEventListener("DOMContentLoaded", function() {
    // Borrar el sessionStorage al cargar la página
    if(sessionStorage.length===1)
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

        //Cargo el tiempo del sesion storage
         var tiempoEmpleado = sessionStorage.getItem('tiempo');
         if(tiempoEmpleado!=null){
            document.getElementById('tiempoEmpleado').textContent = tiempoEmpleado ;
         }else{
             sessionStorage.setItem('tiempo','0m 0s');
             tiempoEmpleado = sessionStorage.getItem('tiempo');
         }
         document.getElementById('tiempoEmpleado').textContent = sessionStorage.getItem('tiempo');
         
         //Falta guardar y comprobar la imagen del canvas

    }
    prepararCanvas();
    prepararEventosCanvas();
});

// Función para actualizar el temporizador
function actualizarTiempo(tiempo) {
    const tiempoEmpleado = document.getElementById('tiempoEmpleado');
    tiempoEmpleado.textContent = tiempo;
    sessionStorage.setItem('tiempo', tiempo);
    // sessionStorage.setItem('tiempo', tiempo);
    // console.log(tiempo);
}


// Función para iniciar el temporizador
function iniciarTemporizador() {
    const tiempoEmpleado = document.getElementById('tiempoEmpleado').textContent;
    let tiempoRegex = /(\d+)m (\d+)s/;
    let match = tiempoEmpleado.match(tiempoRegex);
    let minutos=0;
    let segundos=0;
    if (match) {
         minutos = parseInt(match[1]);
         segundos = parseInt(match[2]);
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
        segundos++;
        if (segundos === 60) {
            minutos++;
            segundos = 0;
        }
        actualizarTiempo(`${minutos}m ${segundos}s`);
    }, 1000);

    // Habilitar el botón "Terminar"
    document.getElementById('stopButton').disabled = false;

    // Detener el temporizador cuando se haga clic en el botón "Terminar"
    document.getElementById('stopButton').addEventListener('click', detenerTemporizador);

    // Remover el evento click del botón "Empezar" para evitar múltiples temporizadores
    document.getElementById('playButton').removeEventListener('click', iniciarTemporizador);

            // Activar radio buttons
    let radioButtons = document.querySelectorAll('input[type="radio"][name="option_grid2"]');
    radioButtons.forEach(button => {
        button.disabled = false;
    });

}

// Función para detener el temporizador y restaurar el estado inicial
function detenerTemporizador() {
    // Obtener los valores de los elementos HTML
    let jugadasRealizadas = document.getElementById('jugadasRealizadas').textContent;
    let piezasCorrectas = document.getElementById('piezasCorrectas').textContent;
    let tiempoEmpleado = document.getElementById('tiempoEmpleado').textContent;

    // Mostrar el modal con la información obtenida
    mostrarMensajeModal(jugadasRealizadas, piezasCorrectas, tiempoEmpleado);
}

// Función para mostrar el mensaje modal y recargar la página después de cerrarlo
function mostrarMensajeModal() {
    // Obtener los valores de jugadas realizadas, piezas correctas y tiempo empleado
    let jugadasRealizadas = document.getElementById('jugadasRealizadas').textContent;
    let piezasCorrectas = document.getElementById('piezasCorrectas').textContent;
    let tiempoEmpleado = document.getElementById('tiempoEmpleado').textContent;
    let mensaje;
    if (victoria===0){
        // Construir el mensaje de derrota
        mensaje = `Oh has perdido!!!\n `;
        mensaje += `Vuelve a intentarlo!\n\n`;
        mensaje += `Jugadas realizadas: ${jugadasRealizadas}\n`;
        mensaje += `Piezas Correctas: ${piezasCorrectas}\n`;
        mensaje += `Tiempo Empleado: ${tiempoEmpleado}\n`;
    }else{
        // Construir el mensaje de victoria
        mensaje = `Has ganado!!!\n `;
        mensaje += `Enhorabuena!\n\n`;
        mensaje += `Jugadas realizadas: ${jugadasRealizadas}\n`;
        mensaje += `Piezas Correctas: ${piezasCorrectas}\n`;
        mensaje += `Tiempo Empleado: ${tiempoEmpleado}\n`;
    }

    sessionStorage.clear();

    // Mostrar el mensaje modal
    alert(mensaje);
    // Recargar la página después de cerrar el mensaje modal
    window.location.reload();
}

// Asociar la función de inicio al botón "Empezar"
document.getElementById('playButton').addEventListener('click', iniciarTemporizador);

//Preparamos el canvas
function prepararCanvas() {
    let cv = document.querySelector('#cv1');

    cv.width = ANCHO_CANVAS;
    cv.height = cv.width;

    // DnD: Origen
    let imgs = document.querySelectorAll('#sec1 > footer > img');

    imgs.forEach( function( img, idx ) {
        img.setAttribute('draggable', 'true');
        img.setAttribute('data-idx', idx);
        img.ondragstart = function( evt ) {
            evt.dataTransfer.setData('text/plain', idx);
        }
    });

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
    cv2 = document.querySelector('#cv2'),
    cv2.width = cv.width;
    cv2.height = cv.height;
    //cv3.width = cv.width;
    //cv3.height = cv.height;
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
    cv.onclick = function(evt) {        
        cargarImagen();
    }
 // Variables para almacenar la pieza seleccionada anteriormente y su posición
    let piezaSeleccionada = null;
    let posicionPiezaSeleccionada = null;

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
            // Almacenar la pieza seleccionada y su posición
            piezaSeleccionada = piezas[indice];
            posicionPiezaSeleccionada = indice;
        } else {
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
    pintarPiezas();
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
    // Obtener la imagen del canvas cv1
    let imgData = cv1.toDataURL();

    // Crear una imagen temporal
    let imgTemp = new Image();
    imgTemp.onload = function() {
        // Clear the canvas before drawing
        cv2.width = cv2.width;

        piezas.forEach(function(pieza, idx) {
            let fila, col, // Posición en el vector de piezas
                fila2, col2;

            fila = Math.floor(idx / nDivs);
            col = idx % nDivs;

            fila2 = Math.floor(pieza / nDivs);
            col2 = pieza % nDivs;

            ctx2.drawImage(imgTemp, col2 * tam, fila2 * tam, tam, tam, col * tam, fila * tam, tam, tam);
            divisiones();
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
