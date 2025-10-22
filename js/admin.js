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
            <td>${
                medico.obrasSociales.length > 0
                    ? medico.obrasSociales.map(osId => {
                        const option = document.querySelector(`#obrasSocialesId option[value="${osId}"]`);
                        const nombre = option ? option.textContent : `ID ${osId}`;
                        return `<span class="d-block text-secondary fw-semibold">${nombre}</span>`;
                    }).join('')
                    : '<span class="text-muted">Sin obras sociales</span>'
            }</td>
            <td><img src="${medico.fotografia}" alt="${medico.nombres}" width="60" class="img-thumbnail"></td>
            <td class="text-center">
                <div class="d-grid gap-2">
                    <button class="btn btn-outline-success btn-sm shadow-sm fw-bold" onclick="cargarMedicoEnFormulario('${medico.id}')">✏️ Editar</button>
                    <button class="btn btn-outline-danger btn-sm shadow-sm fw-bold" onclick="eliminarMedico('${medico.id}')">🗑️ Eliminar</button>
                </div>
            </td>
        `;
        tablaMedicosBody.appendChild(tr);
    });
};

// --- FUNCIÓN PARA MOSTRAR MENSAJES ---
const mostrarMensaje = (texto, tipo = 'success') => {
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo}`;
    alerta.textContent = texto;
    document.getElementById('mensajes').appendChild(alerta);
    setTimeout(() => alerta.remove(), 3000);
};

function generarIdNumerico(medicos) {
    const ids = medicos
        .map(m => parseInt(m.id))
        .filter(n => !isNaN(n));

    const siguienteId = ids.length > 0
        ? Math.max(...ids) + 1
        : 1;

    return siguienteId.toString();
}

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
    const obrasSociales = Array.isArray(tomSelectObrasSociales.getValue()) 
    ? tomSelectObrasSociales.getValue() 
    : [];
    const valorConsulta = parseFloat(document.getElementById('valorConsulta').value) || 0;
    const fotografia = document.getElementById('fotografia').value;
    const medicos = getMedicos();

    // // Validación extra: campos obligatorios
    // if (!matricula.trim() || !nombres.trim() || !especialidadId) {
    //     mostrarMensaje('Por favor, completá matrícula, nombre y especialidad.', 'danger');
    //     return;
    // }

    if (id && medicos.some(m => m.id === id)) {
        // --- MODO EDICIÓN ---
        const matriculaDuplicada = medicos.some(m => m.matricula === matricula && m.id !== id);

        if (matriculaDuplicada) {
            mostrarMensaje('⚠️ Esa matrícula ya está asignada a otro médico.', 'warning');
            return;
        }

        const medicoIndex = medicos.findIndex(m => m.id === id);
        if (medicoIndex > -1) {
            medicos[medicoIndex] = { id, matricula, especialidadId, apellidos, nombres, descripcion, obrasSociales, valorConsulta, fotografia };
        }
        // localStorage.setItem('medicos', JSON.stringify(medicosIniciales));
        mostrarMensaje('✔️Médico actualizado con éxito!', 'success');

    } else {
        // --- MODO CREACIÓN ---
        const matriculaDuplicada = medicos.some(m => m.matricula === matricula);

        if (!id && matriculaDuplicada) {
            mostrarMensaje('⚠️ Ya existe un médico con esa matrícula.', 'warning');
            return; // Evita que se cree el médico
        }

        const nuevoMedico = {
            id: generarIdNumerico(medicos), // Generamos ID correlativo
            matricula, especialidadId, apellidos, nombres,
            descripcion, obrasSociales, valorConsulta, fotografia
        };
        
        medicos.push(nuevoMedico);
        // localStorage.setItem('medicos', JSON.stringify(medicosIniciales));
        mostrarMensaje('✔️ Médico agregado con éxito!', 'success');
    }

    guardarMedicos(medicos);
    resetFormulario();
    renderizarTabla();
});

const resetFormulario = () => {
    medicoForm.reset();
    document.getElementById('id').value = '';
    document.getElementById('id').readOnly = true;
    document.getElementById('matricula').value = '';
    document.getElementById('apellidos').value = '';
    document.getElementById('nombres').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('valorConsulta').value = '';
    document.getElementById('fotografia').value = '';
    tomSelectEspecialidad.clear();
    tomSelectObrasSociales.clear();
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

        // CAMBIO: Asignamos valores a los TomSelect con validación
        if (document.querySelector(`#especialidadId option[value="${medico.especialidadId}"]`)) {
            tomSelectEspecialidad.setValue(medico.especialidadId);
        } else {
            tomSelectEspecialidad.clear(); // Evita error si el valor no existe
        }

        // Filtramos solo las obras sociales que existen en el select actual
        const opcionesValidas = Array.from(document.querySelectorAll('#obrasSocialesId option'))
        .map(opt => opt.value);

        const obrasSocialesValidas = medico.obrasSociales.filter(os => opcionesValidas.includes(os));

        tomSelectObrasSociales.setValue(obrasSocialesValidas);
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

document.getElementById('btnLimpiar').addEventListener('click', () => {
    resetFormulario();
});