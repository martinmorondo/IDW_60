import medicosIniciales from './datos.js';

// --- INICIALIZACIÓN DE TOM-SELECT ---
// Obtenemos las instancias de TomSelect para manipularlas luego
const tomSelectEspecialidad = new TomSelect("#especialidadId", { maxItems: 1 });
const tomSelectObrasSociales = new TomSelect("#obrasSocialesId", { maxItems: null, plugins: ['remove_button'] });

// --- GESTIÓN DEL LOCALSTORAGE ---
const inicializarLocalStorage = () => {
    if (!localStorage.getItem('medicos')) {
        localStorage.setItem('medicos', JSON.stringify(medicosIniciales));
    }
};

const getMedicos = () => JSON.parse(localStorage.getItem('medicos')) || [];
const guardarMedicos = (medicos) => localStorage.setItem('medicos', JSON.stringify(medicos));

// --- RENDERIZADO DE LA TABLA ---
const tablaMedicosBody = document.getElementById('tabla-medicos-body');

// Función para obtener el nombre de la especialidad a partir de su ID
const getNombreEspecialidad = (id) => {
    const especialidadOption = document.querySelector(`#especialidadId option[value="${id}"]`);
    return especialidadOption ? especialidadOption.textContent : 'No definida';
};

const renderizarTabla = () => {
    tablaMedicosBody.innerHTML = '';
    const medicos = getMedicos();

    if (medicos.length === 0) {
        tablaMedicosBody.innerHTML = `<tr><td colspan="9" class="text-center">No hay médicos registrados.</td></tr>`;
        return;
    }

    medicos.forEach(medico => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${medico.id}</td>
            <td>${medico.matricula}</td>
            <td>${medico.apellidos}</td>
            <td>${medico.nombres}</td>
            <td>${getNombreEspecialidad(medico.especialidadId)}</td>
            <td>$${parseFloat(medico.valorConsulta).toFixed(2)}</td>
            <td>${medico.obrasSociales.length} Aceptadas</td>
            <td><img src="${medico.fotografia}" alt="${medico.nombres}" width="50" class="img-thumbnail"></td>
            <td class="text-center">
                <button class="btn btn-warning btn-sm" onclick="cargarMedicoEnFormulario('${medico.id}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarMedico('${medico.id}')">Eliminar</button>
            </td>
        `;
        tablaMedicosBody.appendChild(tr);
    });
};

// --- LÓGICA DEL FORMULARIO (CRUD) ---
const medicoForm = document.getElementById('medicoForm');

medicoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let id = document.getElementById('id').value; // Permitimos que el ID pueda ser nulo
    const matricula = document.getElementById('matricula').value;
    const especialidadId = document.getElementById('especialidadId').value;
    const apellidos = document.getElementById('apellidos').value;
    const nombres = document.getElementById('nombres').value;
    const descripcion = document.getElementById('descripcion').value;
    const obrasSociales = tomSelectObrasSociales.getValue();
    const valorConsulta = document.getElementById('valorConsulta').value;
    const fotografia = document.getElementById('fotografia').value;
    const medicos = getMedicos();

    if (id && medicos.some(m => m.id === id)) {
        // --- MODO EDICIÓN ---
        const medicoIndex = medicos.findIndex(m => m.id === id);
        if (medicoIndex > -1) {
            medicos[medicoIndex] = { id, matricula, especialidadId, apellidos, nombres, descripcion, obrasSociales, valorConsulta, fotografia };
        }
    } else {
        // --- MODO CREACIÓN ---
        const nuevoMedico = {
            id: Date.now().toString(), // Generamos ID único
            matricula, especialidadId, apellidos, nombres, 
            descripcion, obrasSociales, valorConsulta, fotografia
        };
        medicos.push(nuevoMedico);
    }

    guardarMedicos(medicos);
    resetFormulario();
    renderizarTabla();
});

const resetFormulario = () => {
    medicoForm.reset();
    document.getElementById('id').value = '';
    tomSelectEspecialidad.clear();
    tomSelectObrasSociales.clear();
    document.getElementById('id').readOnly = false; // Habilitar el campo ID para nuevos ingresos
}

// Hacemos las funciones globales para poder llamarlas desde el HTML
window.cargarMedicoEnFormulario = (id) => {
    const medicos = getMedicos();
    const medico = medicos.find(m => m.id === id);

    if (medico) {
        // CAMBIO: Llenamos todos los campos de tu formulario
        document.getElementById('id').value = medico.id;
        document.getElementById('id').readOnly = true; // No se puede editar el ID
        document.getElementById('matricula').value = medico.matricula;
        document.getElementById('apellidos').value = medico.apellidos;
        document.getElementById('nombres').value = medico.nombres;
        document.getElementById('descripcion').value = medico.descripcion;
        document.getElementById('valorConsulta').value = medico.valorConsulta;
        document.getElementById('fotografia').value = medico.fotografia;

        // CAMBIO: Asignamos valores a los TomSelect
        tomSelectEspecialidad.setValue(medico.especialidadId);
        tomSelectObrasSociales.setValue(medico.obrasSociales);
    }
};

window.eliminarMedico = (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar a este médico?')) {
        let medicos = getMedicos();
        medicos = medicos.filter(m => m.id !== id);
        guardarMedicos(medicos);
        renderizarTabla();
    }
};

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    inicializarLocalStorage();
    renderizarTabla();
});