'use strict'

/*******************************************************
                        CÓDIGO
*******************************************************/
async function validarUsuario(){
    const login = document.getElementById('usu'),
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

async function validarContrasena(){
    const psw1 = document.getElementById('pwd'),
    psw2 = document.getElementById('pwd2'),
    submitBtn = document.getElementById('submit'),
    mensaje = document.getElementById("msgLogin"),
    iguales = psw1.value === psw2.value;

    if(iguales){
        mensaje.textContent = "";
        submitBtn.disabled = false;
    }else{
        mensaje.style.cssText = "color:red; margin-left:170px; font-size:19px";
        mensaje.textContent = "Las contraseñas no coinciden";
        submitBtn.disabled = true;
    }
    return iguales;
}
