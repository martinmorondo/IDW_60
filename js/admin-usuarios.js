document.addEventListener("DOMContentLoaded", () => {
    const tablaBody = document.getElementById("tabla-usuarios-body");
    tablaBody.innerHTML = `<tr><td colspan="5" class="text-center">Cargando usuarios...</td></tr>`;
  
    const token = sessionStorage.getItem("accessToken");
  
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  
    fetch('https://dummyjson.com/users', fetchOptions)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: No se pudo acceder a la lista de usuarios.`);
        }
        return res.json();
      })
      .then(data => {
        const usuarios = data.users;
        tablaBody.innerHTML = '';
  
        if (usuarios.length === 0) {
          tablaBody.innerHTML = `<tr><td colspan="5" class="text-center">No se encontraron usuarios.</td></tr>`;
          return;
        }
  
        usuarios.forEach(user => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.username}</td>
            <td>${user.password || '🔒'}</td>
            <td>${user.age}</td>
            <td>
              <button class="btn btn-sm btn-verde" onclick="loginComo('${user.username}', '${user.password}')">
                Login como
              </button>
            </td>
          `;
          tablaBody.appendChild(tr);
        });
      })
      .catch(error => {
        console.error("Error al cargar usuarios:", error);
        tablaBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">
          ❌ Error al cargar datos: ${error.message}
        </td></tr>`;
      });
  });
  
  function loginComo(username, password) {
    console.log("Intentando login como:", username, password);
    fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => {
        if (!res.ok) return res.json().then(err => Promise.reject(err));
        return res.json();
      })
      .then(data => {
        sessionStorage.setItem("accessToken", data.token);
        sessionStorage.setItem("usuarioNombre", data.username);
        alert(`Ahora estás logueado como ${data.username}`);
        window.location.href = "medicos.html";
      })
      .catch(err => {
        console.error("Error al loguear como usuario:", err);
        alert("No se pudo iniciar sesión como ese usuario.");
      });
  }