// Referencias
const form = document.querySelector("form");
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

// Mostrar / ocultar contraseña
togglePassword.addEventListener('click', () => {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
});

// Función para mostrar alertas
function mostrarAlerta(mensaje, tipo) {
  // Crear alert dinámico
  const alerta = document.createElement("div");
  alerta.className = `alert alert-${tipo} d-flex align-items-center`;
  alerta.style.position = "fixed";
  alerta.style.top = "20px";
  alerta.style.left = "50%";
  alerta.style.transform = "translateX(-50%)";
  alerta.style.zIndex = "9999";
  alerta.style.minWidth = "300px";
  alerta.style.justifyContent = "center";
  alerta.style.fontSize = "1rem";
  alerta.style.borderRadius = "0.5rem";
  alerta.innerHTML = tipo === "success" ? 
    `<i class="fas fa-check-circle me-2"></i>${mensaje}` :
    `<i class="fas fa-exclamation-triangle me-2"></i>${mensaje}`;
  
  document.body.appendChild(alerta);

  // Desaparece después de 1.5s
  setTimeout(() => {
    alerta.remove();
  }, 1500);
}

// Manejo del formulario
form.addEventListener("submit", function(e){
  e.preventDefault();
  const usuario = document.getElementById("username").value.trim();
  const contrasena = passwordInput.value.trim();

  const userValido = usuarios.find(u => u.usuario === usuario && u.clave === contrasena);

  if(userValido){
    // Guardar sesión en sessionStorage
    sessionStorage.setItem("usuarioActivo", JSON.stringify(userValido));

    // Mostrar alerta de éxito
    mostrarAlerta(`¡Bienvenido, ${usuario}!`, "success");

    // Redirigir a medicos.html
    setTimeout(() => window.location.href = "medicos.html", 1500);

  } else {
    // Mostrar alerta de error
    mostrarAlerta("Usuario o contraseña incorrectos. Redirigiendo a inicio...", "danger");

    // Redirigir a inicio.html
    setTimeout(() => window.location.href = "inicio.html", 2000);
  }
})