document.addEventListener('DOMContentLoaded', async () => {
    //OBTIENE EL USUARIO Y ETIQUETA DE LA URL DE LA PÁGINA
    const valores = location.search;
    const params = new URLSearchParams(valores);
    const usuario = params.get('a');
    const etiqueta = params.get('e');
    let numRecetas;
    if(etiqueta){
        document.querySelector('input[name="etiquetas"]').value = etiqueta;
        let recetas = await realizaBusqueda();
        muestraBusqueda(recetas);
        if(recetas.FILAS.length > 2){
            numRecetas = 2;
        }else{
            numRecetas = recetas.FILAS.length;
        }
        numBusquedas(numRecetas);
        }else if(usuario){

        document.querySelector('input[name="autor"]').value = usuario;
        let recetas = await realizaBusqueda();
        muestraBusqueda(recetas);
  
        if(recetas.FILAS.length > 2){
            numRecetas = 2;
        }else{
            numRecetas = recetas.FILAS.length;
        }
        numBusquedas(numRecetas);
    }
    
});