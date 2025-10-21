<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Administración de Especialidades</title>
  <link rel="icon" href="imagenes/favicon1.ico" type="image/x-icon">
  <link rel="stylesheet" href="bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" href="css/estilos.css">
  <link rel="stylesheet" href="css/formularios.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poetsen+One&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

  <script>
    const usuarioActivo = JSON.parse(sessionStorage.getItem("usuarioActivo"));
    if(!usuarioActivo){
      alert("Acceso no autorizado. Serás redirigido a inicio.");
      window.location.href = "inicio.html";
    }
  </script>
</head>

<body>
  <!-- HEADER / NAVBAR -->
  <header class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <a href="inicio.html" class="logo d-flex flex-column align-items-center text-center text-decoration-none">
        <img src="imagenes/logo_sin_fondo.png" alt="Logo de la página">
        <h1>Centro Integral de Salud Infantil</h1>
      </a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuNav" aria-controls="menuNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <nav class="collapse navbar-collapse" id="menuNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a href="medicos.html" class="nav-link">Médicos</a></li>
          <li class="nav-item"><a href="especialidades.html" class="nav-link active">Especialidades</a></li>
          <li class="nav-item"><a href="#" class="nav-link">Turnos</a></li>
          <li class="nav-item">
            <a href="inicio.html" class="nav-link"><i class="fas fa-sign-out-alt"></i> Salida</a>
          </li>
        </ul>
      </nav>
    </div>
  </header>

  <main>
    <div class="container py-4">
      <h2 class="text-center mb-4 text-success">Administración de Especialidades</h2>

      <!-- Formulario -->
      <div class="card mb-4 shadow-sm">
        <div class="card-header bg-verde text-negrita">Formulario: Especialidades</div>
        <div class="card-body">
          <form id="especialidadForm" class="row g-3">
            <div class="col-md-4">
              <label for="id" class="form-label">ID</label>
              <input type="text" name="id" id="id" class="form-control" readonly />
            </div>
            <div class="col-md-8">
              <label for="nombre" class="form-label">Nombre de la especialidad</label>
              <input type="text" name="nombre" id="nombre" class="form-control" required />
            </div>
            <div class="col-12">
              <label for="descripcion" class="form-label">Descripción</label>
              <textarea name="descripcion" id="descripcion" class="form-control" rows="3" placeholder="Ej: Rama de la medicina enfocada en..."></textarea>
            </div>
            <div class="col-12 text-end">
              <button type="submit" class="btn btn-verde">Guardar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Tabla -->
      <div class="card shadow-sm">
        <div class="card-header bg-verde text-negrita">Listado de Especialidades</div>
        <div class="card-body table-responsive">
          <table class="table table-bordered table-hover table-verde" id="tablaEspecialidades">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody id="tabla-especialidades-body"></tbody>
          </table>
        </div>
      </div>
    </div>
  </main>

  <footer class="footer">
    <div class="footer-content">
      <div class="footer-left">
        <img src="imagenes/logo_sin_fondo.png" alt="Logo Vita Kids" class="logo-footer">
        <h3><strong>Centro Integral de Salud Infantil </strong></h3>
        <p>Av. San Martín 123, CABA, Argentina</p>
      </div>
      <div class="iconos-contacto">
        <a href="mailto:consultas@vitakids.com"><i class="fas fa-envelope"></i></a> 
        <a href="#"><i class="fab fa-facebook-f"></i></a>
        <a href="#"><i class="fab fa-instagram"></i></a>
        <a href="#"><i class="fab fa-whatsapp"></i></a>
      </div>
    </div>
    <div>
      <p>&copy; 2025 Vita Kids S.A - Todos los derechos reservados.</p>
    </div>
  </footer>

  <script src="bootstrap/js/bootstrap.bundle.min.js"></script>
  <script type="module" src="js/especialidades.js"></script>
</body>
</html>
