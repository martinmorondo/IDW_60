import medicosIniciales from './datos.js';

    // --- Nombres de especialidades ---
    const especialidadesIniciales = {
        "1": "Pediatría General", "2": "Neurología pediátrica", "3": "Cardiología pediátrica",
        "4": "Psicología Infantil", "5": "Psicopedagogía", "6": "Fonoaudiología",
        "7": "Oftalmología", "8": "Fisioterapia Infantil", "9": "Nutrición Infantil",
        "10": "Odontopediatría", "11": "Análisis Clínicos"
    };

    // Convierte el objeto estático a un array de objetos { id, nombre } para ABM
export const especialidadesInicialesArray = Object.keys(especialidadesIniciales).map(id => ({
    id: id,
    nombre: especialidadesIniciales[id]
}));

    // Función para obtener las especialidades desde localStorage
const obtenerEspecialidades = () => {
    let especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
    
    // Si no hay datos en localStorage, inicializamos con la lista codificada
    if (especialidades.length === 0) {
        // Convertimos el objeto estático a un array de objetos { id, nombre }
       especialidades = [...especialidadesInicialesArray];
        localStorage.setItem('especialidades', JSON.stringify(especialidades));
    }
    
    // Convertimos el array a un mapa para facilitar la búsqueda por ID en el renderizado
    return especialidades.reduce((acc, esp) => {
        acc[esp.id] = esp.nombre;
        return acc;
    }, {});
};


document.addEventListener('DOMContentLoaded', () => {
    const staffContainer = document.getElementById('staff-medico-container');

    // OBTENER ESPECIALIDADES DESDE LOCALSTORAGE
    const especialidadesMap = obtenerEspecialidades();

    // --- Mapa de obras sociales ---
    const obrasSocialesDetalle = [
       { id: "101", nombre: "OSDE", porcentaje: 35 },
        { id: "102", nombre: "OSPE", porcentaje: 20 },
        { id: "103", nombre: "Swiss Medical", porcentaje: 40 },
        { id: "104", nombre: "Medifé", porcentaje: 25 },
        { id: "105", nombre:"Medicus", porcentaje: 30 },
        { id: "106", nombre: "Galeno", porcentaje: 30 },
        { id: "107", nombre: "OSECAC", porcentaje: 15 },
        { id: "108", nombre: "OSDIPP", porcentaje: 10 },
        { id: "109", nombre: "OSTIG", porcentaje: 15 },
        { id: "110", nombre: "OMINT", porcentaje: 35 },
        { id: "111", nombre: "Sancor Salud", porcentaje: 20 },
        { id: "112", nombre: "Accord Salud", porcentaje: 10 }
    ];

    const obrasSocialesMap = obrasSocialesDetalle.reduce((acc, os) => {
        acc[os.id] = os.nombre; 
        return acc;
    }, {});

    // Función de renderizado
    const renderizarStaff = (medicos) => {
        staffContainer.innerHTML = '';

        const medicosFiltrados = medicos.filter(medico => {
        // Solo incluimos al médico si:
        // 1. Tiene una especialidadId definida, Y
        // 2. Esa especialidadId existe como clave en nuestro mapa dinámico (especialidadesMap)
        return medico.especialidadId && especialidadesMap[medico.especialidadId];
    });

        if (medicosFiltrados.length === 0) {
            staffContainer.innerHTML = `<p class="text-center col-12">No hay profesionales disponibles en este momento.</p>`;
            return;
        }

        medicosFiltrados.forEach(medico => {
            const card = document.createElement('div');
            card.className = 'col-md-6 col-lg-4';

            const nombreCompleto = `${medico.nombres} ${medico.apellidos}`;
            const especialidadNombre = especialidadesMap[medico.especialidadId];

            const obrasSocialesNombre = medico.obrasSociales && medico.obrasSociales.length > 0 
                ? medico.obrasSociales.map(id => obrasSocialesMap[id] || `ID ${id}`).join(', ') 
                : 'Sin obras sociales';

            card.innerHTML = `
                <div class = "card team-card h-100">
                    <div class = "card-img-container">
                        <img src="${medico.fotografia}" class="card-img-top" alt="Foto de ${nombreCompleto}">
                        <div class="card-overlay">
                            <h5 class="card-title"><strong>${nombreCompleto}</strong></h5>
                            <p class="card-text"><strong>Especialidad:</strong> ${especialidadNombre}</p>
                            <p class="card-text"><strong>Obras Sociales:</strong> ${obrasSocialesNombre}</p>
                        </div>
                    </div>
                    <div class="card-body">
                        <a href="turnos.html" class="btn btn-primary w-100 fixed-button">Solicitar turno</a>
                    </div>
                </div>
            `;

            staffContainer.appendChild(card);
        });
    };

    // Iniciamos la carga
    renderizarStaff(medicosIniciales);
});
    
    