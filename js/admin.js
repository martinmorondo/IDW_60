import medicosIniciales from './datos.js';

// Inicializamos el array de médicos en la RAM (simulando la DB de la API)
let medicosEnMemoria = medicosIniciales;

const obrasSocialesDetalle = [
    { id: "101", nombre: "OSDE", porcentaje: 35 },
    { id: "102", nombre: "OSPE", porcentaje: 20 },
    { id: "103", nombre: "Swiss Medical", porcentaje: 40 },
    { id: "104", nombre: "Medifé", porcentaje: 25 },
    { id: "105", nombre: "Medicus", porcentaje: 30 },
    { id: "106", nombre: "Galeno", porcentaje: 30 },
    { id: "107", nombre: "OSECAC", porcentaje: 15 },
    { id: "108", nombre: "OSDIPP", porcentaje: 10 },
    { id: "109", nombre: "OSTIG", porcentaje: 15 },
    { id: "110", nombre: "OMINT", porcentaje: 35 },
    { id: "111", nombre: "Sancor Salud", porcentaje: 20 },
    { id: "112", nombre: "Accord Salud", porcentaje: 10 }
];

// Mapa auxiliar (para renderizar)
const obrasSocialesMap = obrasSocialesDetalle.reduce((acc, os) => {
    acc[os.id] = { nombre: os.nombre, porcentaje: os.porcentaje }; // Guardamos nombre y porcentaje
    return acc;
}, {});

// --- INICIALIZACIÓN DE TOM-SELECT ---
// Obtenemos las instancias de TomSelect para manipularlas luego
const tomSelectEspecialidad = new TomSelect("#especialidadId", { maxItems: 1 });
const tomSelectObrasSociales = new TomSelect("#obrasSocialesId", { maxItems: null, plugins: ['remove_button'] });

// -- Lógica de Simulación de API (Fetch API) ---

// Función para mostrar mensajes
const mostrarMensaje = (texto, tipo = 'success') => {
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo}`;
    alerta.textContent = texto;
    document.getElementById('mensajes').appendChild(alerta);
    setTimeout(() => alerta.remove(), 3000);
};

// SIMULACIÓN GET - Obtiene médicos de la RAM y simula la llamada
const getMedicos = async () => {
    try {
        // Simulación de Llamada GET real
        

        // Retornamos el array en memoria (datos reales de la simulación)
        return medicosEnMemoria;

    } catch (error) {
        console.error("Fallo la simulación GET, usando datos locales:", error);
        return medicosEnMemoria;
    }
};

// SIMULACIÓN POST - Agrega médico a la RAM y simula POST a la API
const agregarMedicoSimulado = async (nuevoMedico) => {
    try {
        // Simulación de Llamada POST real
        
        // Agregamos en la RAM 
        medicosEnMemoria.push(nuevoMedico);

        return true;
    } catch (error) {
        console.error("Fallo en la simulación POST:", error);
        return false;
    }
};

// Simulación PUT - Actualiza médico en la RAM y simula PUT a la API
const actualizarMedicoSimulado = async (medicoActualizado) => {
    try {
       
        
        // Actualizamos en la RAM
        const medicoIndex = medicosEnMemoria.findIndex(m => m.id === medicoActualizado.id);
        if (medicoIndex > -1) {
            medicosEnMemoria[medicoIndex] = medicoActualizado;
        }
        
        return true;
    } catch (error) {
        console.error("Fallo la simulación PUT:", error);
        return false;
    }
};

// SIMULACIÓN DELETE - Elimina médico de la RAM y simula DELETE a la API
window.eliminarMedico = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar a este médico?')) {
        try {           
            medicosEnMemoria = medicosEnMemoria.filter(m => m.id !== id);
            mostrarMensaje('✔️ Médico eliminado con éxito!', 'success');
            renderizarTabla();
        } catch (error) {
            console.error("Fallo en la simulación DELETE:", error);
            mostrarMensaje('❌ Error al intentar eliminar el médico.', 'danger');
        }
    }
};

// --- RENDERIZADO Y LÓGICA DE FORMULARIO  ---
const tablaMedicosBody = document.getElementById('tabla-medicos-body');

const getNombreEspecialidad = (id) => {
    const especialidadOption = document.querySelector(`#especialidadId option[value="${id}"]`);
    return especialidadOption ? especialidadOption.textContent : 'No definida';
};

// Función para obtener el nombre de la Obra Social (usando el mapa auxiliar)
const getNombreObraSocial = (id) => {
    const os = obrasSocialesMap[id];
    return os ? `${os.nombre} (${os.porcentaje}%)` : `ID ${id}`;
};

const renderizarTabla = async () => {
    tablaMedicosBody.innerHTML = '';
    const medicos = await getMedicos(); 

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
                        // Usamos el mapa de Obras Sociales local para mostrar nombre y %
                        const osData = obrasSocialesMap[osId];
                        const nombre = osData ? `${osData.nombre} (${osData.porcentaje}%)` : `ID ${osId}`;
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

medicoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let id = document.getElementById('id').value; // Permitimos que el ID pueda ser nulo
    const matricula = document.getElementById('matricula').value;
    const especialidadId = document.getElementById('especialidadId').value;
    const apellidos = document.getElementById('apellidos').value;
    const nombres = document.getElementById('nombres').value;
    const descripcion = document.getElementById('descripcion').value;
    const obrasSocialesRaw = tomSelectObrasSociales.getValue();
    const obrasSociales = Array.isArray(obrasSocialesRaw) 
    ? obrasSocialesRaw.map(String) // Aseguramos que sean strings (como en el objeto)
    : [];
    const valorConsulta = parseFloat(document.getElementById('valorConsulta').value) || 0;
    const fotografia = document.getElementById('fotografia').value;
    const medicos = await getMedicos(); // <-- Obtenemos la lista actual

    if (id && medicos.some(m => m.id === id)) {
        // --- MODO EDICIÓN ---
        const matriculaDuplicada = medicos.some(m => m.matricula === matricula && m.id !== id);

        if (matriculaDuplicada) {
            mostrarMensaje('⚠️ Esa matrícula ya está asignada a otro médico.', 'warning');
            return;
        }

        const medicoActualizado = { id, matricula, especialidadId, apellidos, nombres, descripcion, obrasSociales, valorConsulta, fotografia};
        
        const exito = await actualizarMedicoSimulado(medicoActualizado); // Usamos Simulación PUT

        if (exito) {
            mostrarMensaje('✔️ Médico actualizado con éxito!', 'success');
        } else {
            mostrarMensaje('❌ Error al actualizar el médico (Simulación).', 'danger');
        }
    } else {
        // --- MODO CREACIÓN ---
        const matriculaDuplicada = medicos.some(m => m.matricula === matricula);

        if (matriculaDuplicada) {
            mostrarMensaje('⚠️ Ya existe un médico con esa matrícula.', 'warning');
            return;
        }

        const nuevoMedico = {
            id: generarIdNumerico(medicos),
            matricula, especialidadId, apellidos, nombres,
            descripcion, obrasSociales, valorConsulta, fotografia
        };

        const exito = await agregarMedicoSimulado(nuevoMedico); // <-- Usamos Simulación POST

        if (exito) {
            mostrarMensaje('✔️ Médico agregado con éxito!', 'success');
        } else {
            mostrarMensaje('❌ Error al agregar el médico (Simulación).', 'danger');
        }
    }

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
window.cargarMedicoEnFormulario = async (id) => {
    const medicos = await getMedicos();
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

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    // inicializarLocalStorage();
    renderizarTabla();
});

document.getElementById('btnLimpiar').addEventListener('click', () => {
    resetFormulario();
});