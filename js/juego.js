// Variable para almacenar el intervalo del temporizador
let intervalo;
const ANCHO_CANVAS = 360;
let nDivs = 5;
document.addEventListener("DOMContentLoaded", function() {
    prepararCanvas();
    prepararEventosCanvas();
});
// Función para actualizar el temporizador
function actualizarTiempo(tiempo) {
    const tiempoEmpleado = document.getElementById('tiempoEmpleado');
    tiempoEmpleado.textContent = tiempo;
}

// Función para iniciar el temporizador
// Función para iniciar el temporizador
// Función para iniciar el temporizador
function iniciarTemporizador() {
    let segundos = 0;
    let minutos = 0;
    let horas = 0;

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
        if(minutos === 60){
            horas++;
            minutos = 0;
            segundos = 0;
        }
        actualizarTiempo(`${horas}h ${minutos}m ${segundos}s`);
    }, 1000);

    // Habilitar el botón "Terminar"
    document.getElementById('stopButton').disabled = false;

    // Detener el temporizador cuando se haga clic en el botón "Terminar"
    document.getElementById('stopButton').addEventListener('click', detenerTemporizador);

    // Remover el evento click del botón "Empezar" para evitar múltiples temporizadores
    document.getElementById('playButton').removeEventListener('click', iniciarTemporizador);
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
    n++;

    // Construir el mensaje
    let mensaje = `Oh has perdido!!!\n `;
    mensaje += `Vuelve a intentarlo!\n\n`;
    mensaje += `Jugadas realizadas: ${jugadasRealizadas}\n`;
    mensaje += `Piezas Correctas: ${piezasCorrectas}\n`;
    mensaje += `Tiempo Empleado: ${tiempoEmpleado}\n`;

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

        // Activar radio buttons
        let radioButtons = document.querySelectorAll('input[type="radio"][name="option_grid2"]');
        radioButtons.forEach(button => {
            button.disabled = false;
        });
    };

    img.src = URL.createObjectURL(fichero);
}

//Cargamos la imagen
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

                // Copiar la imagen del cv1 al cv2
                cv2.width = cv1.width;
                cv2.height = cv1.height;
                ctx2.drawImage(cv1, 0, 0);

                // Activar botón Empezar
                document.getElementById('playButton').disabled = false;

                // Activar radio buttons
                let radioButtons = document.querySelectorAll('input[type="radio"][name="option_grid2"]');
                radioButtons.forEach(button => {
                    button.disabled = false;
                });
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
}

function prepararEventosCanvas() {
    let cv = document.querySelector('#cv1');
        // Desactivar botón Empezar
        document.getElementById('playButton').disabled = true;

        // Desactivar botón Terminar
        document.getElementById('stopButton').disabled = true;
    
        // Desactivar solo los radio buttons con name "option_grid2"
        let radioButtons = document.querySelectorAll('input[type="radio"][name="option_grid2"]');
        radioButtons.forEach(button => {
            button.disabled = true;
    });
    cv.onclick = function(evt) {        
        cargarImagen();
    }
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
function ejecutarPuzzle() {
    mostrarCanvasPuzzle();
    divisiones();
}