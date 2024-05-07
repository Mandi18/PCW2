document.addEventListener('DOMContentLoaded', async () => {
    //OBTIENE EL USUARIO Y ETIQUETA DE LA URL DE LA PÁGINA
    const valores = location.search;
    const params = new URLSearchParams(valores);
    const usuario = params.get('a');
    const etiqueta = params.get('e');
    let recetasUsuario = [];
    let etiquetaSelec;
    if(etiqueta){
        const recetas = await getRecetasTotales();

        let etiquetas = await getEtiquetas();
        etiquetas.FILAS.forEach(async (etiquetaActual) => {
            if(etiquetaActual.nombre === etiqueta){
                etiquetaSelec=etiquetaActual.id;
            }   
        });
        recetas.forEach(async (receta) => {
            const etiquetasReceta = await getRecetaEtiquetasXid(receta.id);

            etiquetasReceta.forEach(async (etiquetaReceta) => {
                if(etiquetaReceta.id === etiquetaSelec){
                    recetasUsuario.push(receta);
                }
            });
        });
    }else if(usuario){

        document.querySelector('input[name="autor"]').value = usuario;
        await realizaBusqueda();
        // const recetas = await getRecetasTotales();
        // recetas.forEach(async (receta) => {

        //     let recetaActual = await getRecetaID(receta.id);
        //     if(recetaActual.FILAS[0].autor === usuario){
        //         recetasUsuario.push(recetaActual.FILAS[0]);
        //     }
        // });
    }
    
});