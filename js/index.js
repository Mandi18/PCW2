'use strict';

document.addEventListener('DOMContentLoaded', async () => {
    const recetas = await getRecetaFiltro({ registrosPorPagina: 6 });

    creaRecetas(recetas);

});