'use strict';

document.addEventListener('DOMContentLoaded', async () => {
    const recetas = await getRecetaFiltro({ registrosPorPagina: 6 });

    let recetasActuales = await creaRecetas(recetas);
    actualizaPaginacion(recetasActuales, recetas);
});