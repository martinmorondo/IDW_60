document.addEventListener('DOMContentLoaded', () => {
    const staffContainer = document.getElementById('staff-medico-container');
    const medicos = JSON.parse(localStorage.getItem('medicos')) || [];

    if (!staffContainer || medicos.length === 0) {
        staffContainer.innerHTML = `<p class="text-center col-12">No hay profesionales disponibles en este momento.</p>`;
        return;
    }

    // --- Nombres de especialidades ---
    const especialidades = {
        "1": "Pediatría General", "2": "Neurología pediátrica", "3": "Cardiología pediátrica",
        "4": "Psicología Infantil", "5": "Psicopedagogía", "6": "Fonoaudiología",
        "7": "Oftalmología", "8": "Fisioterapia Infantil", "9": "Nutrición Infantil",
        "10": "Odontopediatría", "11": "Análisis Clínicos"
    };

    // --- Mapa de obras sociales ---
    const obrasSocialesMap = {
        "101": "OSDE",
        "102": "OSPE",
        "103": "Swiss Medical",
        "104": "Medifé",
        "105": "Medicus",
        "106": "Galeno",
        "107": "OSECAC",
        "108": "OSDIPP",
        "109": "OSTIG",
        "110": "OMINT",
        "111": "Sancor Salud",
        "112": "Accord Salud"
    };

    staffContainer.innerHTML = ''; // Limpiamos el contenedor

    medicos.forEach(medico => {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4';

        const nombreCompleto = `${medico.nombres} ${medico.apellidos}`;
        const especialidadNombre = especialidades[medico.especialidadId] || 'Especialidad no definida';

        // Aquí convertimos correctamente los IDs a nombres
        const obrasSocialesNombres = medico.obrasSociales && medico.obrasSociales.length > 0
            ? medico.obrasSociales.map(id => obrasSocialesMap[id] || `ID ${id}`).join(', ')
            : 'Sin obras sociales';

        card.innerHTML = `
            <div class="card team-card h-100">
                <div class="card-img-container">
                    <img src="${medico.fotografia}" class="card-img-top" alt="Foto de ${nombreCompleto}">
                    <div class="card-overlay">
                        <h5 class="card-title"><strong>${nombreCompleto}</strong></h5>
                        <p class="card-text"><strong>Especialidad:</strong> ${especialidadNombre}</p>
                        <p class="card-text"><strong>Obras Sociales:</strong> ${obrasSocialesNombres}</p>
                    </div>
                </div>
                <div class="card-body">
                    <a href="turnos.html" class="btn btn-primary w-100 fixed-button">Solicitar turno</a>
                </div>
            </div>
        `;

        staffContainer.appendChild(card);
    });
});
