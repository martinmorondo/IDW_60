import { especialidadesDetalle } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. CONSTANTES Y CONFIGURACIÓN
    // ----------------------------------------------------
    const listaEspecialidades = document.getElementById('listaEspecialidades');
    const formEspecialidad = document.getElementById('formEspecialidad');
    const especialidadModal = new bootstrap.Modal(document.getElementById('especialidadModal'));
    const modalTitle = document.getElementById('especialidadModalLabel');


    // ----------------------------------------------------
    // 2. FUNCIONES DE PERSISTENCIA
    // ----------------------------------------------------

    // Función para obtener las especialidades desde localStorage
    const obtenerEspecialidades = () => {
    // Lee desde localStorage
    let especialidades = JSON.parse(localStorage.getItem('especialidades'));
    
    // Si el localStorage está vacío o si lo acabamos de borrar, inicializamos con la lista estática.
    if (!especialidades || especialidades.length === 0) {
        // Usamos una copia de la lista inicial
        especialidades = [...especialidadesDetalle]; 
        guardarEspecialidades(especialidades); // Guardamos la lista completa en localStorage
    }
    
    return especialidades;
};

    // Función para guardar el array completo de especialidades
    const guardarEspecialidades = (especialidades) => {
        localStorage.setItem('especialidades', JSON.stringify(especialidades));
    };

    // ----------------------------------------------------
    // 3. FUNCIÓN PRINCIPAL DE RENDERIZADO (LISTAR)
    // ----------------------------------------------------
    const renderizarEspecialidades = () => {
        listaEspecialidades.innerHTML = '';
        const especialidades = obtenerEspecialidades();

        if (especialidades.length === 0) {
            listaEspecialidades.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No hay especialidades registradas.</td></tr>';
            return;
        }

        especialidades.forEach(especialidad => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${especialidad.id}</td>
                <td>${especialidad.nombre}</td>
                <td>
                    <button class="btn btn-sm btn-info btn-editar" data-id="${especialidad.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger btn-eliminar" data-id="${especialidad.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            listaEspecialidades.appendChild(tr);
        });
    };

    // ----------------------------------------------------
    // 4. LÓGICA DE ABM (ALTA, BAJA, MODIFICACIÓN)
    // ----------------------------------------------------
    
    // Manejo del formulario (Alta y Modificación)
    formEspecialidad.addEventListener('submit', (e) => {
        e.preventDefault();

        const especialidadId = document.getElementById('especialidadId').value;
        const nombreEspecialidad = document.getElementById('nombreEspecialidad').value.trim();
        
        let especialidades = obtenerEspecialidades();
        
        const nuevaEspecialidad = {
            id: especialidadId,
            nombre: nombreEspecialidad
        };

        if (especialidadId) {
            // MODIFICACIÓN (Update)
            const index = especialidades.findIndex(e => e.id === especialidadId);
            if (index !== -1) {
                especialidades[index].nombre = nombreEspecialidad;
            }
        } else {
            // ALTA (Create)
            // Generar un ID simple y único (ej: el ID más alto + 1)
            const maxId = especialidades.length > 0 ? Math.max(...especialidades.map(e => parseInt(e.id, 10))) : 0;
            nuevaEspecialidad.id = (maxId + 1).toString();
            especialidades.push(nuevaEspecialidad);
        }

        guardarEspecialidades(especialidades);
        especialidadModal.hide();
        renderizarEspecialidades();
    });

    // Eventos de la tabla para EDITAR o ELIMINAR
    listaEspecialidades.addEventListener('click', (e) => {
        const id = e.target.closest('button')?.dataset.id;
        if (!id) return;

        let especialidades = obtenerEspecialidades();
        const especialidad = especialidades.find(e => e.id === id);

        if (e.target.closest('.btn-editar')) {
            // EDITAR (Setear modal)
            modalTitle.textContent = 'Editar Especialidad';
            document.getElementById('especialidadId').value = especialidad.id;
            document.getElementById('nombreEspecialidad').value = especialidad.nombre;
            especialidadModal.show();
            
        } else if (e.target.closest('.btn-eliminar')) {
            // ELIMINAR (Delete)
            if (confirm(`ADVERTENCIA: ¿Está seguro de eliminar la especialidad "${especialidad.nombre}"? Esto podría afectar los datos de los médicos.`)) {
                especialidades = especialidades.filter(e => e.id !== id);
                guardarEspecialidades(especialidades);
                renderizarEspecialidades();
            }
        }
    });

    // Limpiar el modal al hacer clic en Agregar
    document.getElementById('btnAgregarEspecialidad').addEventListener('click', () => {
        modalTitle.textContent = 'Nueva Especialidad';
        formEspecialidad.reset();
        document.getElementById('especialidadId').value = '';
    });


    // ----------------------------------------------------
    // 5. INICIALIZACIÓN
    // ----------------------------------------------------
    localStorage.removeItem('especialidades');
    renderizarEspecialidades();
});