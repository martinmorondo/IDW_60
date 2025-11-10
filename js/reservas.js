// 1. IMPORTAR DATOS 
import medicosIniciales from './datos.js';

// 2 DEFINICIÓN DE ESPECIALIDADES
 export  const especialidadesDetalle = [
    { id: "1", nombre: "Pediatría general" },
    { id: "2", nombre: "Neurología Pediátrica" },
    { id: "3", nombre: "Cardiología Pediátrica" },
    { id: "4", nombre: "Oftalmología Pediátrica" },
    { id: "5", nombre: "Psicología Infantil" },
    { id: "6", nombre: "Psicopedagogía" },
    { id: "7", nombre: "Fisioterapia Infantil" },
    { id: "8", nombre: "Fonoaudiología" },
    { id: "9", nombre: "Odontopediatría" },
    { id: "10", nombre: "Nutrición Infantil" },
    { id: "11", nombre: "Análisis Clínicos" },
];

const especialidadesMap = especialidadesDetalle.reduce((acc, esp) => {
    acc[esp.id] = esp.nombre;
    return acc;
}, {});


// 2.1 DEFINICIÓN DE OBRAS SOCIALES (Necesaria para el cálculo del porcentaje)
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
    
];

// 3. FUNCIÓN DE CÁLCULOS
/**
 * Calcula el valor final a pagar por el turno aplicando el descuento de la OS.
 * @param {number} valorConsulta - El valor original de la consulta del médico.
 * @param {string} idObraSocial - El ID de la Obra Social seleccionada.
 * @returns {number} El valor final de la consulta con el descuento aplicado.
 */
const calcularValorTurno = (valorConsulta, idObraSocial) => {
    const osSeleccionada = obrasSocialesDetalle.find(os => String(os.id) === String(idObraSocial));

    // Validaciones
    if (!osSeleccionada || osSeleccionada.id === 'ninguna' || typeof osSeleccionada.porcentaje !== 'number') {
        return valorConsulta;
    }

    if (!osSeleccionada || idObraSocial === 'ninguna') {
    return valorConsulta;
}

    // Cálculo del descuento
    const descuento = osSeleccionada.porcentaje / 100;
    const valorFinal = valorConsulta * (1 - descuento);

    // Redondeamos y devolvemos el valor final
    return parseFloat(valorFinal.toFixed(2));
};



// 4. EJEMPLO DE LÓGICA DE PROCESAMIENTO DE RESERVA (Simulación de guardar en una 'DB' de Reservas)
document.addEventListener('DOMContentLoaded', () => {
    const turnosForm = document.getElementById('turnosForm'); 
    const obraSocialSelect = document.getElementById('obraSocialSelect');
    const especialidadSelect = document.getElementById('especialidad');
    const medicoSelect = document.getElementById('medicoSelect');

    let valorTurnoFinalCalculado = 0; // Variable global para el valor final

   const cargarObrasSociales = () => {
    obraSocialSelect.innerHTML = `
        <option value="" disabled selected>Seleccioná una obra social...</option>
        <option value="ninguna">Particular (Sin Obra Social)</option>
    `;

    obrasSocialesDetalle.forEach(os => {
        const option = document.createElement('option');
        option.value = os.id;
        option.textContent = `${os.nombre} (${os.porcentaje || 0}%)`;
        obraSocialSelect.appendChild(option);
    });
};

    /** Llena el select de Especialidades basándose en la OS seleccionada. */
    const llenarEspecialidades = (osId) => {
        especialidadSelect.innerHTML = '<option value="" disabled selected>Seleccioná una especialidad...</option>';
        
        // 1. Filtrar Médicos que aceptan la OS
        const medicosCubiertos = medicosIniciales.filter(medico => {
            // Verifica si acepta la OS, o si se seleccionó 'ninguna'
            return osId === 'ninguna' || (medico.obrasSociales && medico.obrasSociales.includes(osId));
        });

        // 2. Obtener IDs de especialidades únicas
        const especialidadesCubiertasIDs = [...new Set(medicosCubiertos.map(m => m.especialidadId))];

        // 3. Llenar el Select
        const especialidadesFiltradas = especialidadesDetalle.filter(esp => especialidadesCubiertasIDs.includes(esp.id));
        
        especialidadesFiltradas.forEach(esp => {
            const option = document.createElement('option');
            option.value = esp.id;
            option.textContent = esp.nombre;
            especialidadSelect.appendChild(option);
        });

        especialidadSelect.disabled = especialidadesFiltradas.length === 0;
        // Reiniciar médico
        medicoSelect.innerHTML = '<option value="" disabled selected>Seleccioná un médico...</option>';
        medicoSelect.disabled = true;
    };

    /** Llena el select de Médicos basándose en la Especialidad y OS. */
    const llenarMedicos = (especialidadId, osId) => {
        medicoSelect.innerHTML = '<option value="" disabled selected>Seleccioná un médico...</option>';
        
        // 1. Filtrar Médicos por Especialidad Y Obra Social
        const medicosFiltrados = medicosIniciales.filter(medico => {
            const cubreEspecialidad = medico.especialidadId === especialidadId;
            const aceptaOS = osId === 'ninguna' || (medico.obrasSociales && medico.obrasSociales.includes(osId));
            return cubreEspecialidad && aceptaOS;
        });

        // 2. Llenar el Select y calcular el valor inicial
        medicosFiltrados.forEach(medico => {
            const valorCalculado = calcularValorTurno(medico.valorConsulta, osId);
            const option = document.createElement('option');
            option.value = medico.id;
            // Mostramos el valor final estimado en el select
            option.textContent = `${medico.nombres} ${medico.apellidos} ($${valorCalculado.toFixed(2)})`;
            medicoSelect.appendChild(option);
        });
        
        medicoSelect.disabled = medicosFiltrados.length === 0;
    };
    
    // ----------------------------------------------------
    // 7. EVENT LISTENERS PARA EL FILTRADO
    // ----------------------------------------------------

    // Evento 1: Obra Social cambia -> Cargar Especialidades
    obraSocialSelect.addEventListener('change', () => {
        const osId = obraSocialSelect.value;
        llenarEspecialidades(osId);
    });

    // Evento 2: Especialidad cambia -> Cargar Médicos
    especialidadSelect.addEventListener('change', () => {
        const especialidadId = especialidadSelect.value;
        const osId = obraSocialSelect.value; 
        llenarMedicos(especialidadId, osId);
    });

    // Evento 3: Médico cambia -> Almacenar el valor final para el submit
    medicoSelect.addEventListener('change', () => {
        const idMedico = medicoSelect.value;
        const idObraSocial = obraSocialSelect.value;
        const medico = medicosIniciales.find(m => m.id === idMedico);

        if (medico) {
            valorTurnoFinalCalculado = calcularValorTurno(medico.valorConsulta, idObraSocial);
            console.log(`Valor de consulta final: $${valorTurnoFinalCalculado.toFixed(2)}`);
            // Opcional: mostrar valor en un div si tienes un elemento para ello (por ejemplo: #valorFinalDisplay)
        }
    });
    
    if (turnosForm) {
        turnosForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const idMedico = medicoSelect.value;
            const idObraSocial = obraSocialSelect.value;
            const medicoSeleccionado = medicosIniciales.find(m => m.id === idMedico);

            if (!medicoSeleccionado || !idMedico || !idObraSocial) {
                alert("Por favor, selecciona Obra Social, Especialidad y Médico.");
                return;
            }

            const valorConsultaMedico = medicoSeleccionado.valorConsulta;
            
            // Usamos el valor calculado en el evento change del médico, o lo recalculamos
            const valorTurnoFinal = valorTurnoFinalCalculado || calcularValorTurno(valorConsultaMedico, idObraSocial);
            
            // 💡 CREACIÓN Y PERSISTENCIA DE LA RESERVA
            const nuevaReserva = {
                id: Date.now().toString(),
                paciente: document.getElementById('nombre').value, 
                dni: document.getElementById('dni').value, 
                fecha: document.getElementById('fecha').value, 
                motivo: document.getElementById('motivo').value,
                medicoId: idMedico,
                obraSocialId: idObraSocial,
                valorOriginal: valorConsultaMedico,
                valorTurnoFinal: valorTurnoFinal, 
                estado: 'Reservado'
            };

            const turnosGuardados = JSON.parse(localStorage.getItem('turnos')) || [];
            turnosGuardados.push(nuevaReserva);
            localStorage.setItem('turnos', JSON.stringify(turnosGuardados));

            alert(`Turno reservado con éxito. Valor final a pagar: $${valorTurnoFinal.toFixed(2)}`);
            turnosForm.reset();
            // Restablecer selects deshabilitados
            especialidadSelect.disabled = true;
            medicoSelect.disabled = true;
        });
    }

    // 9. INICIALIZACIÓN
    cargarObrasSociales(); 
    especialidadSelect.disabled = true;
    medicoSelect.disabled = true;
});