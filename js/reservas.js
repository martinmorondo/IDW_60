import medicosIniciales from './datos.js'; 
import { especialidadesDetalle } from './utils.js'; 
import { obrasSocialesIniciales as obrasSocialesInicialesArray } from './datos1.js'; 

// 2. MAPAS DE BÚSQUEDA (Para obtener nombres a partir de IDs)
const medicosMap = medicosIniciales.reduce((acc, med) => {
    acc[med.id] = med; // Guardamos el objeto completo
    return acc;
}, {});

const especialidadesMap = especialidadesDetalle.reduce((acc, esp) => {
    acc[esp.id] = esp.nombre;
    return acc;
}, {});

// 3. FUNCIÓN DE CÁLCULO 
const calcularValorTurno = (valorConsulta, idObraSocial) => {
    const osSeleccionada = obrasSocialesInicialesArray.find(os => String(os.id) === String(idObraSocial));
    if (!osSeleccionada || idObraSocial === 'ninguna' || typeof osSeleccionada.porcentaje !== 'number') {
        return valorConsulta;
    }
    const descuento = osSeleccionada.porcentaje / 100;
    const valorFinal = valorConsulta * (1 - descuento);
    return parseFloat(valorFinal.toFixed(2));
};


document.addEventListener('DOMContentLoaded', () => {

    // 4. CONSTANTES DEL DOM
    const container = document.getElementById('turnos-disponibles-container');
    const reservaModal = new bootstrap.Modal(document.getElementById('reservaModal'));
    const formReserva = document.getElementById('formReserva');
    const pacienteOSSelect = document.getElementById('pacienteOS');
    const valorFinalReservaDisplay = document.getElementById('valorFinalReserva');
    
    let turnoSeleccionado = null; // Guardará el turno que se está reservando

    // 5. FUNCIÓN DE RENDERIZADO
    const renderizarTurnosDisponibles = () => {
        container.innerHTML = '';
        
        // Obtenemos TODOS los turnos creados por el Admin
        const todosLosTurnos = JSON.parse(localStorage.getItem('turnos')) || [];
        
        // Filtramos solo los disponibles
        const turnosDisponibles = todosLosTurnos.filter(t => t.disponible === true); // <-- Busca 'disponible: true'
        
        if (turnosDisponibles.length === 0) {
            container.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay turnos disponibles por el momento.</td></tr>';
            return;
        }

        turnosDisponibles.forEach(turno => {
            const medico = medicosMap[turno.medicoId];
            if (!medico) return; // Si el médico no existe, no mostrar el turno

            const especialidadNombre = especialidadesMap[medico.especialidadId] || 'N/A';
            
            
            // Formateamos la fecha para que se vea bien
            const fechaFormateada = new Date(turno.fechaHora).toLocaleString('es-AR', {
                dateStyle: 'short',
                timeStyle: 'short',
                hour12: false
            });
            
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${fechaFormateada}</td>
                <td>${especialidadNombre}</td>
                <td>${medico.nombres} ${medico.apellidos}</td>
                <td>$${medico.valorConsulta.toFixed(2)}</td>
                <td>
                    <button class="btn btn-success btn-sm btn-reservar" 
                            data-id="${turno.id}" 
                            data-bs-toggle="modal" 
                            data-bs-target="#reservaModal">
                        Reservar
                    </button>
                </td>
            `;
            container.appendChild(tr);
        });
    };

    // 6. LLENAR EL SELECT DE OBRAS SOCIALES (EN EL MODAL)
    const cargarObrasSocialesModal = () => {
        pacienteOSSelect.innerHTML = '<option value="" disabled selected>Seleccione Obra Social...</option>';
        pacienteOSSelect.innerHTML += '<option value="ninguna">Particular (Sin Obra Social)</option>';
        
        obrasSocialesInicialesArray.forEach(os => {
            const option = document.createElement('option');
            option.value = os.id;
            option.textContent = `${os.nombre} (${os.porcentaje || 0}%)`;
            pacienteOSSelect.appendChild(option);
        });
    };

    // 7. MANEJO DE EVENTOS
    
    // Evento para ABRIR EL MODAL (cuando se hace clic en "Reservar")
    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-reservar')) {
            const turnoId = e.target.dataset.id;
            const todosLosTurnos = JSON.parse(localStorage.getItem('turnos')) || [];
            turnoSeleccionado = todosLosTurnos.find(t => t.id === turnoId);
            
            if (!turnoSeleccionado) return;

            const medico = medicosMap[turnoSeleccionado.medicoId];

            // Rellenar el modal
            document.getElementById('turnoIdReserva').value = turnoSeleccionado.id;
            document.getElementById('reservaMedico').textContent = `${medico.nombres} ${medico.apellidos}`;
            
            const fechaFormateadaModal = new Date(turnoSeleccionado.fechaHora).toLocaleString('es-AR', {
                dateStyle: 'short', timeStyle: 'short', hour12: false
            });
            document.getElementById('reservaFecha').textContent = fechaFormateadaModal;
            
            // Calcular valor inicial (Particular)
            const valorInicial = calcularValorTurno(medico.valorConsulta, 'ninguna');
            valorFinalReservaDisplay.textContent = `Valor final: $${valorInicial.toFixed(2)}`;
        }
    });

    // Evento para RECALCULAR VALOR al cambiar OS en el modal
    pacienteOSSelect.addEventListener('change', () => {
        if (!turnoSeleccionado) return;
        
        const medico = medicosMap[turnoSeleccionado.medicoId];
        const osId = pacienteOSSelect.value;
        const valorFinal = calcularValorTurno(medico.valorConsulta, osId);
        
        valorFinalReservaDisplay.textContent = `Valor final: $${valorFinal.toFixed(2)}`;
    });

    // Evento para CONFIRMAR LA RESERVA (Submit del Modal)
    formReserva.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const todosLosTurnos = JSON.parse(localStorage.getItem('turnos')) || [];
        const turnoId = document.getElementById('turnoIdReserva').value;
        const index = todosLosTurnos.findIndex(t => t.id === turnoId);

        if (index === -1) {
            alert("Error: El turno ya no está disponible.");
            return;
        }

        // Datos del paciente
        const pacienteNombre = document.getElementById('pacienteNombre').value;
        const pacienteDNI = document.getElementById('pacienteDNI').value;
        const pacienteOS = document.getElementById('pacienteOS').value;
        
        // Recalcular el valor final por seguridad
        const medico = medicosMap[todosLosTurnos[index].medicoId];
        const valorFinal = calcularValorTurno(medico.valorConsulta, pacienteOS);

        // ACTUALIZAMOS EL TURNO (Convertimos "Turno" en "Reserva")
        todosLosTurnos[index].paciente = pacienteNombre;
        todosLosTurnos[index].dni = pacienteDNI;
        todosLosTurnos[index].obraSocialId = pacienteOS;
        todosLosTurnos[index].valorTurnoFinal = valorFinal; // Guardamos el valor final
        todosLosTurnos[index].disponible = false; // <-- El admin entiende esto como "No disponible"

        // Guardar en localStorage
        localStorage.setItem('turnos', JSON.stringify(todosLosTurnos));

        alert(`¡Reserva confirmada para ${pacienteNombre}!\nValor a pagar: $${valorFinal.toFixed(2)}`);
        
        reservaModal.hide();
        renderizarTurnosDisponibles(); // Actualizar la lista (el turno reservado desaparecerá)
    });


    // 8. INICIALIZACIÓN
    renderizarTurnosDisponibles();
    cargarObrasSocialesModal();
});

