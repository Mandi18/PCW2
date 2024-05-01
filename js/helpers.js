function prepararFiltro({autor, nombre, ingrediente, etiqueta, dificultad, numeroReg, cantidadReg}){

    if(numeroReg !== undefined && cantidadReg !== undefined){
        numeroReg = Number(numeroReg);
        cantidadReg = Number(cantidadReg);
    }
    let urlPeticion = 'api/recetas';
    let existeParametro = false;
    
    if(autor){
        if(!existeParametro){
            urlPeticion += `?a=${autor}`;
            existeParametro = true;
        }else{
            urlPeticion += `&a=${autor}`;
        }
    }

    //TODO: falta el campo de elaboracion
    if(nombre){
        if(!existeParametro){
            urlPeticion += `?t=${nombre}`;
            existeParametro = true;
        }else{
            urlPeticion += `&t=${nombre}`;
        }
    }

    if(ingrediente){
        if(!existeParametro){
            urlPeticion += `?i=${ingrediente}`;
            existeParametro = true;
        }else{
            urlPeticion += `&i=${ingrediente}`;
        }
    }

    if(etiqueta){
        if(!existeParametro){
            urlPeticion += `?e=${etiqueta}`;
            existeParametro = true;
        }else{
            urlPeticion += `&e=${etiqueta}`;
        }
    }

    if(dificultad){
        if(!existeParametro){
            urlPeticion += `?d=${dificultad}`;
            existeParametro = true;
        }else{
            urlPeticion += `&d=${dificultad}`;
        }
    }

    if(numeroReg !== undefined && cantidadReg !== undefined){
        if(!existeParametro){
            urlPeticion += `?reg=${numeroReg}&cant=${cantidadReg}`;
            existeParametro = true; 
        }else{
            urlPeticion += `&reg=${numeroReg}&cant=${cantidadReg}`;
        }
    }

    //devolvemos el objeto que hemos ido creando por partes
    return urlPeticion;
}

function isLogged(){
    return sessionStorage.getItem('token') && sessionStorage.getItem('usuario');
}