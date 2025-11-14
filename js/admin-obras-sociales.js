import { obrasSocialesIniciales as obrasSocialesInicialesArray } from './datos1.js';

document.addEventListener('DOMContentLoaded', () => {

    localStorage.removeItem('obrasSociales'); 

    // ----------------------------------------------------
    // 1. CONSTANTES Y CONFIGURACIÓN
    // ----------------------------------------------------
    const listaObrasSociales = document.getElementById('listaObrasSociales');
    const formObraSocial = document.getElementById('formObraSocial');
    const obraSocialModal = new bootstrap.Modal(document.getElementById('obraSocialModal'));
    const modalTitle = document.getElementById('obraSocialModalLabel');

    // ----------------------------------------------------
    // 2. FUNCIONES DE PERSISTENCIA
    // ----------------------------------------------------

    const guardarObrasSociales = (obras) => {
        localStorage.setItem('obrasSociales', JSON.stringify(obras));
    };

    const obtenerObrasSociales = () => {
        let obras = JSON.parse(localStorage.getItem('obrasSociales'));
        
        if (!obras || obras.length === 0) {
            obras = [...obrasSocialesInicialesArray];
            guardarObrasSociales(obras);
        }
        return obras;
    };

    // ----------------------------------------------------
    // 3. FUNCIÓN PRINCIPAL DE RENDERIZADO (LISTAR)
    // ----------------------------------------------------
    const renderizarObrasSociales = () => {
        listaObrasSociales.innerHTML = '';
        const obras = obtenerObrasSociales(); 

        if (obras.length === 0) {
            listaObrasSociales.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No hay obras sociales registradas.</td></tr>';
            return;
        }

        obras.forEach(obra => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${obra.id}</td>
                <td>${obra.nombre}</td>
                <td>${obra.porcentaje}%</td>
                <td>
                    <button class="btn btn-sm btn-info btn-editar" data-id="${obra.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger btn-eliminar" data-id="${obra.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            listaObrasSociales.appendChild(tr);
        });
    };

    // ----------------------------------------------------
    // 4. LÓGICA DE ABM (ALTA, BAJA, MODIFICACIÓN)
    // ----------------------------------------------------
    
    formObraSocial.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = document.getElementById('obraSocialId').value;
        const nombre = document.getElementById('nombreObraSocial').value.trim();
        const porcentaje = parseInt(document.getElementById('porcentajeCobertura').value, 10);
        const logo = document.getElementById('logoObraSocial').value.trim();
        const url = document.getElementById('urlObraSocial').value.trim();
        
        // (Validaciones simples)
        if (!nombre || nombre.length < 3) {
            alert('El nombre debe tener al menos 3 caracteres.');
            return;
        }
        if (isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) {
            alert('El porcentaje debe ser un número entre 0 y 100.');
            return;
        }

        if (!url.startsWith('http')) {
        alert('La URL debe ser un enlace web válido (ej: debe empezar con http:// o https://).');
        return;
    }

        let obras = obtenerObrasSociales(); 
        
        const nombreDuplicado = obras.some(o => o.nombre.toLowerCase() === nombre.toLowerCase() && o.id !== id);
        if (nombreDuplicado) {
            alert('Ya existe una Obra Social con ese nombre.');
            return;
        }
        
        const nuevaObra = {
            id: id,
            nombre: nombre,
            porcentaje: porcentaje,
            logo: logo, 
            url: url    
        };

        if (id) {
            // MODIFICACIÓN
            const index = obras.findIndex(o => o.id === id);
            if (index !== -1) {
            obras[index] = nuevaObra; 
        }
        } else {
            // ALTA
            const maxId = obras.length > 0 ? Math.max(...obras.map(o => parseInt(o.id, 10))) : 100;
            nuevaObra.id = (maxId + 1).toString();
            obras.push(nuevaObra);
        }

        guardarObrasSociales(obras);
        obraSocialModal.hide();
        renderizarObrasSociales(); 
    });

    listaObrasSociales.addEventListener('click', (e) => {
        const id = e.target.closest('button')?.dataset.id;
        if (!id) return;

        let obras = obtenerObrasSociales(); 
        const obra = obras.find(o => o.id === id);

        if (e.target.closest('.btn-editar')) {
            // EDITAR
            modalTitle.textContent = 'Editar Obra Social';
            document.getElementById('obraSocialId').value = obra.id;
            document.getElementById('nombreObraSocial').value = obra.nombre;
            document.getElementById('porcentajeCobertura').value = obra.porcentaje;
            document.getElementById('logoObraSocial').value = obra.logo || 'default.png';
            document.getElementById('urlObraSocial').value = obra.url || '#';
            obraSocialModal.show();
            
        } else if (e.target.closest('.btn-eliminar')) {
            // ELIMINAR
            if (confirm(`ADVERTENCIA: ¿Está seguro de eliminar la Obra Social "${obra.nombre}"?`)) {
                obras = obras.filter(o => o.id !== id);
                guardarObrasSociales(obras);
                renderizarObrasSociales(); 
            }
        }
    });

    // Limpiar el modal al hacer clic en Agregar
    document.getElementById('btnAgregarObraSocial').addEventListener('click', () => {
        modalTitle.textContent = 'Nueva Obra Social';
        formObraSocial.reset();
        document.getElementById('obraSocialId').value = '';
        document.getElementById('logoObraSocial').value = 'default.png'; 
        document.getElementById('urlObraSocial').value = '#';
    });

    // ----------------------------------------------------
    // 5. INICIALIZACIÓN
    // ----------------------------------------------------
    renderizarObrasSociales(); // Carga la lista inicial
});
