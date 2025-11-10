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
  const username = document.getElementById("username").value.trim();
  const password = passwordInput.value.trim();

  // 1. URL de la API de DummyJSON para login
  const loginUrl = 'https://dummyjson.com/auth/login';

  fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: username,
      password: password,
    })
  })
  .then(res => {
    // Si la respuesta no es OK (ej: 400, 401), lanzamos un error para el catch
    if (!res.ok) {
      return res.json().then(err => Promise.reject(err));
    }
    return res.json();
  })
  .then(data => {
    // 2. ÉXITO: Guardar el accessToken en sessionStorage
    sessionStorage.setItem("accessToken", data.token);
    sessionStorage.setItem("usuarioNombre", data.username);

    mostrarAlerta(`¡Bienvenido, ${data.username}!`, "success");

    // Redirigir a medicos.html
    setTimeout(() => window.location.href = "medicos.html", 1500);
  })
  .catch(error => {
    // ERROR
    console.error("Error en login:", error);
    // Usamos el mensaje de error que viene de la API si está disponible
    mostrarAlerta(error.message || "Usuario o contraseña incorrectos", "danger");

    // Redirigimos a inicio.html (o dejar en el login, según la política)
    // setTimeout(() => window.location.href = "inicio.html", 2000);
  })
});
