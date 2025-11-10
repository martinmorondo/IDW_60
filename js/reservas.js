import medicosIniciales from './datos.js';

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. CONSTANTES Y CONFIGURACIÓN
    // ----------------------------------------------------
    const listaTurnos = document.getElementById('listaTurnos');
    const formTurno = document.getElementById('formTurno');
    const turnoModal = new bootstrap.Modal(document.getElementById('turnoModal'));
    const modalTitle = document.getElementById('turnoModalLabel');
    const medicoSelect = document.getElementById('medicoSelect');
    const osSelect = document.getElementById('osSelect');
    const valorFinalDisplay = document.getElementById('valorFinalDisplay');

    // Mapeo de Obras Sociales 
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
    { id: "112", nombre: "Accord Salud", porcentaje: 10 },
    { id: "ninguna", nombre: "Particular (Sin OS)", porcentaje: 0 }
    ];
    
    // Mapeo inverso de Médicos (para buscar por ID)
    const medicosMap = medicosIniciales.reduce((acc, medico) => {
        acc[medico.id] = `${medico.nombres} ${medico.apellidos}`;
        return acc;
    }, {});

    // Mapeo inverso de OS (para mostrar el nombre en la tabla)
    const osMap = obrasSocialesDetalle.reduce((acc, os) => {
        acc[os.id] = os.nombre;
        return acc;
    }, {});

    // ----------------------------------------------------
    // 2. FUNCIONES DE CARGA DE DATOS EN SELECTS
    // ----------------------------------------------------
    const cargarMedicos = () => {
        medicoSelect.innerHTML = '<option value="">Seleccione Médico</option>';
        medicosIniciales.forEach(medico => {
            const option = document.createElement('option');
            option.value = medico.id;
            option.textContent = `${medico.nombres} ${medico.apellidos} ($${medico.valorConsulta})`;
            medicoSelect.appendChild(option);
        });
    };

    const cargarObrasSociales = () => {
        osSelect.innerHTML = '<option value="">Seleccione Obra Social</option>';
        obrasSocialesDetalle.forEach(os => {
            const option = document.createElement('option');
            option.value = os.id;
            option.textContent = `${os.nombre} (${os.porcentaje || 0}%)`;
            osSelect.appendChild(option);
        });
    };
    
    // Función de cálculo (duplicada de turnos.js para independencia)
    const calcularValorTurno = (valorConsulta, idObraSocial) => {
        const osSeleccionada = obrasSocialesDetalle.find(os => os.id === idObraSocial);
        if (!osSeleccionada || typeof osSeleccionada.porcentaje !== 'number' || osSeleccionada.porcentaje < 0) {
            return valorConsulta;
        }
        const porcentajeDecimal = osSeleccionada.porcentaje / 100;
        const valorFinal = valorConsulta * (1 - porcentajeDecimal);
        return parseFloat(valorFinal.toFixed(2));
    };


    // ----------------------------------------------------
    // 3. FUNCIÓN PRINCIPAL DE RENDERIZADO (LISTAR)
    // ----------------------------------------------------
    const renderizarTurnos = () => {
        listaTurnos.innerHTML = '';
        const turnos = JSON.parse(localStorage.getItem('turnos')) || [];

        if (turnos.length === 0) {
            listaTurnos.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No hay turnos registrados.</td></tr>';
            return;
        }

        turnos.forEach(turno => {
            const medicoNombre = medicosMap[turno.medicoId] || 'Desconocido';
            const osNombre = osMap[turno.obraSocialId] || 'Particular';
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${turno.id}</td>
                <td>${turno.paciente}</td>
                <td>${turno.fecha}</td>
                <td>${medicoNombre}</td>
                <td>${osNombre}</td>
                <td>$${turno.valorTurnoFinal.toFixed(2)}</td>
                <td><span class="badge bg-${turno.estado === 'Cancelado' ? 'danger' : turno.estado === 'Confirmado' ? 'success' : 'warning'}">${turno.estado}</span></td>
                <td>
                    <button class="btn btn-sm btn-info btn-editar" data-id="${turno.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger btn-eliminar" data-id="${turno.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            listaTurnos.appendChild(tr);
        });
    };

    // ----------------------------------------------------
    // 4. LÓGICA DE ABM (ALTA, BAJA, MODIFICACIÓN)
    // ----------------------------------------------------

    // Función para obtener los valores actuales y recalcular el precio
    const obtenerYRecalcularValores = () => {
        const idMedico = medicoSelect.value;
        const idObraSocial = osSelect.value;
        
        const medico = medicosIniciales.find(m => m.id === idMedico);
        const valorBase = medico ? medico.valorConsulta : 0;
        
        const valorFinal = calcularValorTurno(valorBase, idObraSocial);
        
        valorFinalDisplay.textContent = `Valor final: $${valorFinal.toFixed(2)}`;
        return { valorBase, valorFinal };
    };

    // Eventos para recalcular el precio al cambiar médico u OS
    medicoSelect.addEventListener('change', obtenerYRecalcularValores);
    osSelect.addEventListener('change', obtenerYRecalcularValores);
    
    // Manejo del formulario (Alta y Modificación)
    formTurno.addEventListener('submit', (e) => {
        e.preventDefault();

        const medico = medicosIniciales.find(m => m.id === medicoSelect.value);
        const { valorBase, valorFinal } = obtenerYRecalcularValores();
        
        const turnoId = document.getElementById('turnoId').value;
        
        const nuevoTurno = {
            id: turnoId || Date.now().toString(),
            paciente: document.getElementById('pacienteNombre').value,
            fecha: document.getElementById('fechaTurno').value,
            medicoId: medicoSelect.value,
            obraSocialId: osSelect.value,
            valorOriginal: valorBase,
            valorTurnoFinal: valorFinal,
            estado: document.getElementById('estadoTurno').value,
        };

        let turnos = JSON.parse(localStorage.getItem('turnos')) || [];

        if (turnoId) {
            // MODIFICACIÓN (Update)
            const index = turnos.findIndex(t => t.id === turnoId);
            if (index !== -1) {
                turnos[index] = nuevoTurno;
            }
        } else {
            // ALTA (Create)
            turnos.push(nuevoTurno);
        }

        localStorage.setItem('turnos', JSON.stringify(turnos));
        turnoModal.hide();
        renderizarTurnos();
    });

    // Eventos de la tabla para EDITAR o ELIMINAR
    listaTurnos.addEventListener('click', (e) => {
        const id = e.target.closest('button')?.dataset.id;
        if (!id) return;

        let turnos = JSON.parse(localStorage.getItem('turnos')) || [];
        const turno = turnos.find(t => t.id === id);

        if (e.target.closest('.btn-editar')) {
            // EDITAR (Setear modal)
            modalTitle.textContent = 'Editar Turno';
            document.getElementById('turnoId').value = turno.id;
            document.getElementById('pacienteNombre').value = turno.paciente;
            document.getElementById('fechaTurno').value = turno.fecha;
            medicoSelect.value = turno.medicoId;
            osSelect.value = turno.obraSocialId;
            document.getElementById('estadoTurno').value = turno.estado;
            obtenerYRecalcularValores(); // Recalcula el precio al cargar
            turnoModal.show();
            
        } else if (e.target.closest('.btn-eliminar')) {
            // ELIMINAR (Delete)
            if (confirm(`¿Está seguro de eliminar el turno de ${turno.paciente} en la fecha ${turno.fecha}?`)) {
                turnos = turnos.filter(t => t.id !== id);
                localStorage.setItem('turnos', JSON.stringify(turnos));
                renderizarTurnos();
            }
        }
    });

    // Limpiar el modal al cerrarse o al hacer clic en Agregar
    document.getElementById('btnAgregarTurno').addEventListener('click', () => {
        modalTitle.textContent = 'Nuevo Turno';
        formTurno.reset();
        document.getElementById('turnoId').value = '';
        valorFinalDisplay.textContent = 'Valor final: $0.00';
    });


    // ----------------------------------------------------
    // 5. INICIALIZACIÓN
    // ----------------------------------------------------
    cargarMedicos();
    cargarObrasSociales();
    renderizarTurnos();
});