document.addEventListener('DOMContentLoaded', async () => {
    //OBTIENE EL ID DE LA URL DE LA PÁGINA
    const valores = location.search;
    const params = new URLSearchParams(valores);
    const idReceta = params.get('id');
    
    if(!idReceta){
        location.href = "index.html";
    }else{
        // HACEMOS LA PETICIÓN AL SERVIDOR PARA OBTENER LOS DATOS
        const respuesta = await getRecetaID(idReceta);
        const receta = respuesta.FILAS[0];

        if(!receta){
            location.href = "index.html";
        }
    }
});