import medicosDesdeArchivo from './datos.js';

const formTurnoAdmin = document.getElementById('formTurnoAdmin');
const medicoSelectAdmin = document.getElementById('medicoSelectAdmin');
const tablaTurnos = document.querySelector('#tablaTurnos tbody');

let turnos = JSON.parse(localStorage.getItem('turnos')) || [];

function obtenerMedicos() {
    const guardados = localStorage.getItem('medicos');
    if (guardados) {
      try {
        return JSON.parse(guardados);
      } catch (e) {
        console.warn("Error al parsear médicos desde localStorage. Se usará el archivo por defecto.");
      }
    }

    // Si no hay datos válidos en localStorage, usar los del archivo y guardarlos
    localStorage.setItem('medicos', JSON.stringify(medicosDesdeArchivo));
    return medicosDesdeArchivo;
  }

  function renderMedicos() {
    // Limpiar el select
    medicoSelectAdmin.innerHTML = '<option value="">Seleccionar médico...</option>';

    obtenerMedicos().forEach(m => {
      const option = document.createElement('option');
      option.value = m.id;
      option.textContent = `${m.nombres} ${m.apellidos}`;
      medicoSelectAdmin.appendChild(option);
    });

    // Destruir instancia previa si existe
    if (medicoSelectAdmin.tomselect) {
      medicoSelectAdmin.tomselect.destroy();
    }

    // Inicializar Tom Select (el CSS ya fuerza apertura hacia arriba)
    new TomSelect("#medicoSelectAdmin", {
      create: false,
      sortField: {
        field: "text",
        direction: "asc"
      }
    });
  }


function renderTurnos() {
  tablaTurnos.innerHTML = "";
  turnos.forEach(turno => {
    const medico = obtenerMedicos().find(m => m.id === turno.medicoId);
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${turno.id}</td>
      <td>${turno.medicoId}</td> 
      <td>${medico ? medico.nombres + " " + medico.apellidos : "Desconocido"}</td>
      
      <td>${new Date(turno.fechaHora).toLocaleString('es-AR', {
        dateStyle: 'short',
        timeStyle: 'short',
        hour12: false
      })}</td>
      
      
      <td>${turno.disponible ? "✅" : "❌"}</td>
      <td class="text-center">
        <button class="btn btn-success btn-sm rounded-2 me-2" title="Editar" onclick="editarTurno('${turno.id}')">
        <i class="fas fa-edit"></i></button>
        <button class="btn btn-danger btn-sm rounded-2" title="Eliminar" onclick="eliminarTurno('${turno.id}')">
        <i class="fas fa-trash-alt"></i></button>
      </td>
    `;
    tablaTurnos.appendChild(fila);
  });
}

formTurnoAdmin.addEventListener('submit', e => {
  e.preventDefault();
  const medicoId = medicoSelectAdmin.value;
  const fechaHora = document.getElementById('fechaHoraTurno').value;

  const nuevoTurno = {
    id: `T-${medicoId}-${fechaHora.replace(/[^0-9]/g, '')}`,
    medicoId,
    fechaHora,
    disponible: true
  };

  turnos.push(nuevoTurno);
  localStorage.setItem('turnos', JSON.stringify(turnos));
  renderTurnos();
  formTurnoAdmin.reset();
});

window.editarTurno = function(id) {
  const turno = turnos.find(t => t.id === id);
  const nuevaFecha = prompt("Nueva fecha y hora (YYYY-MM-DDTHH:mm)", turno.fechaHora);
  if (nuevaFecha) {
    turno.fechaHora = nuevaFecha;
    localStorage.setItem('turnos', JSON.stringify(turnos));
    renderTurnos();
  }
};

window.eliminarTurno = function(id) {
  if (confirm("¿Eliminar este turno?")) {
    turnos = turnos.filter(t => t.id !== id);
    localStorage.setItem('turnos', JSON.stringify(turnos));
    renderTurnos();
  }
};

renderMedicos();
renderTurnos(); 
