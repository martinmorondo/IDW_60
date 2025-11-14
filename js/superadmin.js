document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");

  // 👁️ Mostrar / ocultar contraseña
  togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    togglePassword.textContent = isPassword ? "🙈" : "👁️";
  });

  // 🔐 Validación local de superadmin
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = passwordInput.value.trim();

    const SUPERADMIN = {
      username: "admin",
      password: "admin123"
    };

    if (username === SUPERADMIN.username && password === SUPERADMIN.password) {
      sessionStorage.setItem("superadmin", "true");
      mostrarAlerta("✅ ¡Bienvenido, Superadmin!", "success");
      setTimeout(() => window.location.href = "admin-usuarios.html", 1500);
    } else {
      mostrarAlerta("❌ Usuario o contraseña incorrectos", "danger");
      // passwordInput.value = "";
      // document.getElementById("username").focus();
      // Limpiar ambos campos
      document.getElementById("username").value = "";
      passwordInput.value = "";

      // Enfocar nuevamente en el campo de usuario
      document.getElementById("username").focus();
    }
  });

  // ✅ Función para mostrar alertas
  function mostrarAlerta(mensaje, tipo) {
    const alerta = document.createElement("div");
    alerta.className = `alert alert-${tipo}`;
    alerta.style.position = "fixed";
    alerta.style.top = "20px";
    alerta.style.left = "50%";
    alerta.style.transform = "translateX(-50%)";
    alerta.style.zIndex = "9999";
    alerta.style.minWidth = "300px";
    alerta.style.textAlign = "center";
    alerta.style.borderRadius = "0.5rem";
    alerta.textContent = mensaje;

    document.body.appendChild(alerta);
    setTimeout(() => alerta.remove(), 2000);
  }
});