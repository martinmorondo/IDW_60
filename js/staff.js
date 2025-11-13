document.addEventListener('DOMContentLoaded', () => {
    const staffContainer = document.getElementById('staff-medico-container');

    // --- Función para transformar arrays en mapas ---
    const transformarArrayAMapa = (array, clave = 'id', valor = 'nombre') => {
        return array.reduce((acc, item) => {
            acc[item[clave]] = item[valor];
            return acc;
        }, {});
    };

    // --- Obtener médicos desde localStorage o respaldo ---
    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    if (!medicos || medicos.length === 0) {
        if (typeof medicosIniciales !== 'undefined') {
            medicos = medicosIniciales;
        } else {
            staffContainer.innerHTML = `<p class="text-center col-12">No hay profesionales disponibles en este momento.</p>`;
            return;
        }
    }

    // --- Obtener especialidades y obras sociales desde localStorage ---
    const especialidadesRaw = JSON.parse(localStorage.getItem('especialidades')) || [];
    const obrasSocialesRaw = JSON.parse(localStorage.getItem('obrasSociales')) || [];

    const especialidades = Array.isArray(especialidadesRaw)
        ? transformarArrayAMapa(especialidadesRaw)
        : especialidadesRaw;

    const obrasSociales = Array.isArray(obrasSocialesRaw)
        ? transformarArrayAMapa(obrasSocialesRaw)
        : obrasSocialesRaw;

    // --- Renderizado de cards ---
    staffContainer.innerHTML = '';

    const medicosFiltrados = medicos.filter(medico => medico.nombres && medico.apellidos);

    if (medicosFiltrados.length === 0) {
        staffContainer.innerHTML = `<p class="text-center col-12">No hay profesionales disponibles en este momento.</p>`;
        return;
    }

    medicosFiltrados.forEach(medico => {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4';

        const nombreCompleto = `${medico.nombres} ${medico.apellidos}`;
        const especialidadNombre = especialidades[medico.especialidadId] || 'Especialidad eliminada';

        const obrasSocialesNombres = medico.obrasSociales?.length
            ? medico.obrasSociales.map(id => obrasSociales[id] || 'Obra Social eliminada').join(', ')
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