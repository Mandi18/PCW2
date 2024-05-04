'use strict'

/*******************************************************
                        FUNCIONES
*******************************************************/
var pass_puesto = false


/*******************************************************
                        CÓDIGO
*******************************************************/
async function validarUsuario(){
    const login = document.getElementById('nombre'),
    loginMsg = document.getElementById('msgLogin'),
    submitBtn = document.getElementById('submit');

    let loginDisponible = null;
    if(login.value !== ""){
        loginDisponible = getDisponibilidadLogin(login.value)
            .then((loginDisponible) => {
                if(!loginDisponible.DISPONIBLE){
                    loginMsg.style.cssText = "color:red; margin-left:210px; font-size:19px";
                    loginMsg.textContent = "Usuario no disponible";
                    const br = document.createElement('br');
                    loginMsg.appendChild(br);
                    submitBtn.disabled = true;
                }else{
                    loginMsg.textContent = "";
                    submitBtn.disabled = false;
                }
            }).catch(err => {
                console.error(err);
            });
    }
    return loginDisponible;
}

function validarContrasena(){
    // Uso de pass_puesto que es una variable creada arriba de todo el código
    let psw1 = document.getElementById('password').value;
    let psw2 = document.getElementById('password2').value;
    iguales = true;;
    if(psw1 != psw2){
        if(!pass_puesto){
            let aviso = document.createElement("span");
            aviso.id = "aviso";
            aviso.innerHTML = "Las contraseñas no coinciden";
            document.getElementById('registro2').appendChild(aviso);
            iguales = false;
            pass_puesto = true;
        }
    }else{
        if(pass_puesto){
            document.getElementById('aviso').remove();
            pass_puesto = false;
        }
    }
}