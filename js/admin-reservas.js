import medicosIniciales from './datos.js';
import { obrasSocialesDetalle as obrasSocialesInicialesArray } from './utils.js';
import { especialidadesDetalle as especialidadesInicialesArray } from './utils.js';

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

    // ----------------------------------------------------
    // 2. FUNCIONES DE LECTURA 
    // ----------------------------------------------------
    const getMedicos = () => JSON.parse(localStorage.getItem('medicos')) || [];
    const getObrasSociales = () => JSON.parse(localStorage.getItem('obrasSociales')) || [];
    const getEspecialidades = () => JSON.parse(localStorage.getItem('especialidades')) || [];
    const getTurnos = () => JSON.parse(localStorage.getItem('turnos')) || [];

    // ----------------------------------------------------
    // 3. FUNCIONES DE CARGA DE DATOS 
    // ----------------------------------------------------
    const cargarMedicos = () => {
        const medicos = getMedicos();
        medicoSelect.innerHTML = '<option value="">Seleccione Médico</option>';
        medicos.forEach(medico => {
            const option = document.createElement('option');
            option.value = medico.id;
            option.textContent = `${medico.nombres} ${medico.apellidos} ($${medico.valorConsulta})`;
            medicoSelect.appendChild(option);
        });
    };

    const cargarObrasSociales = () => {
        const obras = getObrasSociales(); 
        osSelect.innerHTML = '<option value="">Seleccione Obra Social</option>';
        obras.forEach(os => {
            const option = document.createElement('option');
            option.value = os.id;
            option.textContent = `${os.nombre} (${os.porcentaje || 0}%)`;
            osSelect.appendChild(option);
        });
    };
    
    // Función de cálculo 
    const calcularValorTurno = (valorConsulta, idObraSocial) => {
        const obras = getObrasSociales();
        const osSeleccionada = obras.find(os => os.id === idObraSocial);
        if (!osSeleccionada || typeof osSeleccionada.porcentaje !== 'number' || osSeleccionada.porcentaje < 0) {
            return valorConsulta;
        }
        const porcentajeDecimal = osSeleccionada.porcentaje / 100;
        const valorFinal = valorConsulta * (1 - porcentajeDecimal);
        return parseFloat(valorFinal.toFixed(2));
    };


    // ----------------------------------------------------
    // 4. FUNCIÓN PRINCIPAL DE RENDERIZADO (LISTAR TURNOS)
    // ----------------------------------------------------
    const renderizarTurnos = () => {
        listaTurnos.innerHTML = '';
        const turnos = getTurnos();
        
        const medicos = getMedicos();
        const especialidadesMap = getEspecialidades().reduce((acc, esp) => {
            acc[esp.id] = esp.nombre;
            return acc;
        }, {});
        const osMap = getObrasSociales().reduce((acc, os) => {
            acc[os.id] = os.nombre;
            return acc;
        }, {});

        if (turnos.length === 0) {
            listaTurnos.innerHTML = '<tr><td colspan="9" class="text-center text-muted">No hay turnos registrados.</td></tr>';
            return;
        }

        turnos.forEach(turno => {
            const medico = medicos.find(m => m.id === turno.medicoId); 
            
            // Si el médico fue borrado, mostramos "N/A"
            const medicoNombre = medico ? `${medico.nombres} ${medico.apellidos}` : '<span class="text-danger">Médico Eliminado</span>';
            
            // Si la OS fue borrada, el mapa dará 'undefined', así que mostramos "Particular" o "Eliminada"
            const osNombre = osMap[turno.obraSocialId] || (turno.paciente ? '<span class="text-danger">OS Eliminada</span>' : 'Particular');
            
            // Si la especialidad fue borrada, mostramos "N/A"
            let especialidadNombre = '<span class="text-danger">N/A</span>';
            if (medico && medico.especialidadId) {
                especialidadNombre = especialidadesMap[medico.especialidadId] || '<span class="text-danger">Especialidad Eliminada</span>';
            }

            let estadoTexto, estadoClase;
            if (turno.estado) {
                estadoTexto = turno.estado;
                estadoClase = estadoTexto === 'Cancelado' ? 'danger' : estadoTexto === 'Confirmado' ? 'success' : 'warning';
            } else {
                if (turno.disponible === true) { estadoTexto = 'Disponible'; estadoClase = 'primary'; }
                else if (turno.disponible === false) { estadoTexto = 'Confirmado'; estadoClase = 'success'; }
                else { estadoTexto = 'Indefinido'; estadoClase = 'secondary'; }
            }
        
            const pacienteNombre = turno.paciente ||  '<span class="text-muted">Disponible (sin paciente)</span>';
            const fechaRaw = turno.fechaHora || turno.fecha;
            const fechaMostar = fechaRaw ? new Date(fechaRaw).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short', hour12: false }) : 'Fecha no definida';   
            
            // Si el valor no está (ej. en un turno 'disponible'), muestra N/A
            const valorFinalTexto = turno.valorTurnoFinal ? `$${turno.valorTurnoFinal.toFixed(2)}` : '<span class="text-muted">N/A</span>';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${turno.id}</td>
                <td>${pacienteNombre}</td>
                <td>${fechaMostar}</td>
                <td>${medicoNombre}</td>
                <td>${especialidadNombre}</td>
                <td>${osNombre}</td>
                <td>${valorFinalTexto}</td>
                <td><span class="badge bg-${estadoClase}">${estadoTexto}</span></td>
                <td>
                    <button class="btn btn-sm btn-info btn-editar" data-id="${turno.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger btn-eliminar" data-id="${turno.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            listaTurnos.appendChild(tr);
        });
    };

    // ----------------------------------------------------
    // 5. LÓGICA DE ABM (Alta/Modificación de Turno)
    // ----------------------------------------------------

    // Función para obtener los valores actuales y recalcular el precio
    const obtenerYRecalcularValores = () => {
        const idMedico = medicoSelect.value;
        const idObraSocial = osSelect.value;
        
        const medicos = getMedicos(); 
        const medico = medicos.find(m => m.id === idMedico);
        const valorBase = medico ? medico.valorConsulta : 0;
        
        const valorFinal = calcularValorTurno(valorBase, idObraSocial); 
        
        valorFinalDisplay.textContent = `Valor final: $${valorFinal.toFixed(2)}`;
        return { valorBase, valorFinal };
    };

    // Recalcular el precio al cambiar médico u OS
    medicoSelect.addEventListener('change', obtenerYRecalcularValores);
    osSelect.addEventListener('change', obtenerYRecalcularValores);
    
    // Manejo del formulario (Alta y Modificación)
    formTurno.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Recalcula el valor por seguridad
        const { valorBase, valorFinal } = obtenerYRecalcularValores();
        
        const turnoId = document.getElementById('turnoId').value;
        
        const nuevoTurno = {
            id: turnoId || `T-${Date.now()}`, // ID único para turnos manuales
            paciente: document.getElementById('pacienteNombre').value,
            fecha: document.getElementById('fechaTurno').value,
            medicoId: medicoSelect.value,
            obraSocialId: osSelect.value,
            valorOriginal: valorBase,
            valorTurnoFinal: valorFinal,
            estado: document.getElementById('estadoTurno').value,
        };

        let turnos = getTurnos();

        if (turnoId) {
            // MODIFICACIÓN
            const index = turnos.findIndex(t => t.id === turnoId);
            if (index !== -1) {
                turnos[index] = nuevoTurno;
            }
        } else {
            // ALTA
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

        let turnos = getTurnos();
        const turno = turnos.find(t => t.id === id);
        if (!turno) return; // Seguridad por si el turno no existe

        if (e.target.closest('.btn-editar')) {
            // EDITAR
            modalTitle.textContent = 'Editar Turno';
            document.getElementById('turnoId').value = turno.id;
            document.getElementById('pacienteNombre').value = turno.paciente || '';
            document.getElementById('fechaTurno').value = turno.fecha || (turno.fechaHora ? turno.fechaHora.split('T')[0] : '');
            medicoSelect.value = turno.medicoId;
            osSelect.value = turno.obraSocialId;
            document.getElementById('estadoTurno').value = turno.estado || 'Reservado';
            obtenerYRecalcularValores();
            turnoModal.show();
            
        } else if (e.target.closest('.btn-eliminar')) {
            // ELIMINAR
            const paciente = turno.paciente || 'el turno disponible';
            if (confirm(`¿Está seguro de eliminar el turno de ${paciente}?`)) {
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
    // 6. INICIALIZACIÓN y LISTENER
    // ----------------------------------------------------
    
    localStorage.setItem('medicos', JSON.stringify(medicosIniciales));
    localStorage.setItem('obrasSociales', JSON.stringify(obrasSocialesInicialesArray));
    localStorage.setItem('especialidades', JSON.stringify(especialidadesInicialesArray));

    // Carga inicial
    cargarMedicos();
    cargarObrasSociales();
    renderizarTurnos();

    window.addEventListener('storage', (event) => {
        // Si CUALQUIERA de las listas de admin cambia...
        if (event.key === 'medicos' || event.key === 'obrasSociales' || event.key === 'especialidades') {
            // ... recarga los <select> Y vuelve a dibujar la tabla.
            cargarMedicos();
            cargarObrasSociales();
            renderizarTurnos();
        }
    });
});