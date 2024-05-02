function pedirRecetas() {
    let url ='../api/recetas',
        xhr = new XMLHttpRequest();

         url += '?reg=0&cant=2&t=a&e=pasta';

    xhr.open('GET', url, true);

    xhr.responseType = 'json';

    xhr.onload = function() {
        let r = xhr.response;

        console.log( r );
        if(r.RESULTADO == 'OK'){
            let html ='';

            r.FILAS.forEach(function(e,idx) {
                html+= `<li>${e.nombre}</li>`
            });
            document.querySelector('#lista').innerHTML = html;
        }
    }
    xhr.send();
}

function hacerLogin(evt){
    evt.preventDefault();
    let url = '../api/usuarios/login',
    xhr = new XMLHttpRequest(),
    frm = evt.currentTarget, //formulario
    fd = new FormData(frm);

    xhr.open('POST', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        let r = xhr.response;

        console.log(r);
        if(r.RESULTADO == 'OK'){
            sessionStorage['datosUsu']= JSON.stringify(r);
        }
    } 
    xhr.send(fd);
}

function dejarComentario(){
    let url = '../api/recetas/1/comentarios',

    xhr = new  XMLHttpRequest(),
    fd = new  FormData(/*añadir formulario*/),
    usu, // datos del usuario
    auth; //autorización

    if(sessionStorage['datosUsu']){
        usu = JSON.parse(
            sessionStorage['datosUsu']);
        auth = usu.LOGIN + ':' + usu.TOKEN;
        xhr.open('POST', url, true);
            xhr.responseType = 'json';
    xhr.onload = function() {
        let r = xhr.response;

        console.log(r);
        }
        fd.append('titulo', 'Título del comentario');
        fd.append('texto', 'Texto del comentario');
        xhr.setRequestHeader('Authorization', auth);
        xhr.send(fd);
    }
}