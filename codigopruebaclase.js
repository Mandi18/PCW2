function mostrarInfoReceta(){
    let idReceta;
    idReceta = location.search.substring(1);
    if(isNaN(idReceta)){
        location.href = 'index.html';
    }else{
        let url = 'api/recetas', xhr = new XMLHttpRequest();
        url += '/' + idReceta;
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function(e){
            let r = xhr.response;
            console.log(r);
            if(r.RESULTADO == 'OK'){
                    let receta = r.FILAS[0];
                    document.querySelector('h1').innerHTML = receta.nombre;
                    document.querySelector('p').innerHTML = receta.elaboracion;
                    //Pedir ingredientes
                    /*mostrarIngredientes(idReceta);
                    url='api/recetas/' + idReceta + '/ingredientes';*/
            }
        }

        xhr.send();
    }
}

function mostrarMensaje(){
    let dialogo = document.createElement('dialog'), html ='';
    html += '<h2>Titulo del diálogo</h2>';
    html += '<p>Mensaje del diálogo</p>';
    html += '<div>';
    html += '<button onclick="aceptar();">Aceptar</button>';
    html += '<button onclick="cancelar();">Cancelar</button>';
    html += '<div>';
    dialogo.innerHTML = html;
    dialogo.oncancel = function(){
        console.log('ESCAPE');
    }
    dialogo.onclose = function(){
        console.log('CLOSE');
    }
    document.body.appendChild(dialogo);
    dialogo.showModal();
}

function aceptar(){
    document.querySelector('dialog').close();
    document.querySelector('dialog').remove();

    console.log('Aceptar');
}

function cancelar(){
    document.querySelector('dialog').close();
    document.querySelector('dialog').remove();

    console.log('Cancelar');
}
let idTimer;
function actualizarTO(){
    let fechaHora = new Date(), texto;
    texto = fechaHora.getHours() + ":" + fechaHora.getMinutes() + ":" + fechaHora.getSeconds(); 
    
    document.querySelector('#tiempoTO').innerHTML = texto;

    idTimer = setTimeout(actualizarTO, 1000);
}

function empezarTO(){
   idTimer = setTimeout(actualizarTO, 1000);
}

function pararTO(){
    clearTimeout(id);
}