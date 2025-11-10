import { obrasSocialesInicialesArray } from './datos-os.js';


const obtenerObrasSocialesParaPublico = () => {
    let obras = JSON.parse(localStorage.getItem('obrasSociales'));
    
    if (!obras || obras.length === 0) {
        // Inicialización si no se ha hecho, usando los datos importados.
        obras = obrasSocialesInicialesArray;
        localStorage.setItem('obrasSociales', JSON.stringify(obras));
    }
    return obras;
};


document.addEventListener('DOMContentLoaded', () => {
    // 1. OBTENER EL CONTENEDOR
    const container = document.getElementById('obras-sociales-container');
    
    // 2. OBTENER DATOS
    const obrasSociales = obtenerObrasSocialesParaPublico();
    
    // 3. LIMPIAR CONTENIDO ESTATICO Y RENDERIZAR DINÁMICAMENTE
    if (container) {
        container.innerHTML = ''; // Borra contenido estático
        
        obrasSociales.forEach(obra => {
            const col = document.createElement('div');
            col.className = 'col';
            col.innerHTML = `
                <a href="${obra.url || '#'}" target="_blank" class="logo-card" title="${obra.nombre} - Cobertura: ${obra.porcentaje}%">
                    <img src="imagenes/${obra.logo || 'default.png'}" alt="${obra.nombre}" class="img-fluid">
                </a>
            `;
            container.appendChild(col);
        });
    }
});