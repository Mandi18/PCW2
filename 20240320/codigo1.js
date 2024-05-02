function pedirRecetas() {
    let url = 'api/recetas',
        xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);

    xhr.responseType = 'json';

    xhr.onload = function() {
        let r = xhr.response;

        console.log( r );
        if( r.RESULTADO == 'OK') {
            let html = '';

            r.FILAS.forEach( function(e, idx) {
                html += `<li>${e.nombre}</li>`;
            });
            document.querySelector('#lista').innerHTML = html;
        }
    }

    xhr.send();

}

function hacerLogin( evt ) {
    evt.preventDefault();

    let url = 'api/usuarios/login',
        xhr = new XMLHttpRequest(),
        frm = evt.currentTarget, // formulario
        fd  = new FormData( frm );

        xhr.open('POST', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
            let r = xhr.response;

            console.log( r );
            if( r.RESULTADO == 'OK' ) {
                sessionStorage['datosUsu'] = JSON.stringify( r );
            }
        }

        xhr.send( fd );
}

