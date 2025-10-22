      // turnos.js

// Función para inicializar LocalStorage de turnos (si no existe)
function initializeTurnos() {
  if (!localStorage.getItem('turnos')) {
    localStorage.setItem('turnos', JSON.stringify([])); // Array vacío inicialmente
  }
}

// Función para obtener turnos del LocalStorage
function getTurnos() {
  return JSON.parse(localStorage.getItem('turnos')) || [];
}

// Función para guardar turnos en LocalStorage
function saveTurnos(turnos) {
  localStorage.setItem('turnos', JSON.stringify(turnos));
}

// Función para crear un nuevo turno
function createTurno(turno) {
  const turnos = getTurnos();
  turno.id = Date.now(); // ID único simple basado en timestamp
  turnos.push(turno);
  saveTurnos(turnos);
}

// Función para actualizar un turno
function updateTurno(id, updatedTurno) {
  const turnos = getTurnos();
  const index = turnos.findIndex(t => t.id == id);
  if (index !== -1) {
    turnos[index] = { ...turnos[index], ...updatedTurno };
    saveTurnos(turnos);
  }
}

// Función para eliminar un turno
function deleteTurno(id) {
  const turnos = getTurnos();
  const filtered = turnos.filter(t => t.id != id);
  saveTurnos(filtered);
}

// Función para renderizar la tabla de turnos
function renderTurnos() {
  const turnos = getTurnos();
  const container = document.getElementById('tabla-turnos');
  container.innerHTML = ''; // Limpiar contenido anterior

  // Crear tabla dinámicamente
  const table = document.createElement('table');
  table.className = 'tabla-turnos'; // Clase para CSS
  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Paciente</th>
        <th>Médico</th>
        <th>Especialidad</th>
        <th>Fecha</th>
        <th>Hora</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector('tbody');
  if (turnos.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="8">No hay turnos registrados.</td>';
    tbody.appendChild(row);
  } else {
    turnos.forEach(turno => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${turno.id}</td>
        <td>${turno.paciente}</td>
        <td>${turno.medicoNombre} (ID: ${turno.medicoId})</td>
        <td>${turno.especialidad}</td>
        <td>${turno.fecha}</td>
        <td>${turno.hora}</td>
        <td><span class="badge estado-${turno.estado}">${turno.estado}</span></td>
        <td class="acciones">
          <button onclick="viewTurno(${turno.id})" class="btn-ver"><i class="fas fa-eye"></i> Ver</button>
          <button onclick="editTurno(${turno.id})" class="btn-editar"><i class="fas fa-edit"></i> Editar</button>
          <button onclick="deleteTurno(${turno.id})" class="btn-eliminar"><i class="fas fa-trash"></i> Eliminar</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  container.appendChild(table);
}

// Función para editar un turno (poblar formulario)
function editTurno(id) {
  const turnos = getTurnos();
  const turno = turnos.find(t => t.id == id);
  if (turno) {
    document.getElementById('turno-id').value = turno.id;
    document.getElementById('paciente').value = turno.paciente;
    document.getElementById('medicoId').value = turno.medicoId;
    document.getElementById('medicoNombre').value = turno.medicoNombre;
    document.getElementById('especialidad').value = turno.especialidad;
    document.getElementById('fecha').value = turno.fecha;
    document.getElementById('hora').value = turno.hora;
    document.getElementById('estado').value = turno.estado;
    document.getElementById('motivo').value = turno.motivo;
  }
}

// Función para visualizar un turno en el modal
function viewTurno(id) {
  const turnos = getTurnos();
  const turno = turnos.find(t => t.id == id);
  if (turno) {
    const detalle = document.getElementById('detalle-turno');
    detalle.innerHTML = `
      <p><strong>ID:</strong> ${turno.id}</p>
      <p><strong>Paciente:</strong> ${turno.paciente}</p>
      <p><strong>Médico:</strong> ${turno.medicoNombre} (ID: ${turno.medicoId})</p>
      <p><strong>Especialidad:</strong> ${turno.especialidad}</p>
      <p><strong>Fecha:</strong> ${turno.fecha}</p>
      <p><strong>Hora:</strong> ${turno.hora}</p>
      <p><strong>Estado:</strong> ${turno.estado}</p>
      <p><strong>Motivo:</strong> ${turno.motivo}</p>
    `;
    document.getElementById('modal-detalle').style.display = 'block';
  }
}

// Función para cerrar el modal
function cerrarModal() {
  document.getElementById('modal-detalle').style.display = 'none';
}

// Función para limpiar el formulario
function limpiarFormulario() {
  document.getElementById('formulario-turno').reset();
  document.getElementById('turno-id').value = '';
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  initializeTurnos();
  renderTurnos();
  
  // Manejar submit del formulario
  const form = document.getElementById('formulario-turno');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const turno = {
      paciente: document.getElementById('paciente').value,
      medicoId: document.getElementById('medicoId').value,
      medicoNombre: document.getElementById('medicoNombre').value,
      especialidad: document.getElementById('especialidad').value,
      fecha: document.getElementById('fecha').value,
      hora: document.getElementById('hora').value,
      estado: document.getElementById('estado').value,
      motivo: document.getElementById('motivo').value
    };
    
    const id = document.getElementById('turno-id').value;
    if (id) {
      // Editar
      updateTurno(id, turno);
    } else {
      // Crear
      createTurno(turno);
    }
    
    limpiarFormulario();
    renderTurnos();
  });
});

// Funciones globales para que sean accesibles desde HTML (botones onclick)
window.editTurno = editTurno;
window.viewTurno = viewTurno;
window.deleteTurno = (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este turno?')) {
    deleteTurno(id);
    renderTurnos();
  }
};
window.limpiarFormulario = limpiarFormulario;
window.cerrarModal = cerrarModal;
