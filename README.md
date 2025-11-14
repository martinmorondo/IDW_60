# IDW_60 - Trabajo Final Integrador

## Vita Kids - Sistema de Gestión de Turnos Médicos

### Introducción
Este proyecto es la entrega final integradora de la materia Introducción al Desarrollo Web (2025) de la Tecnicatura Universitaria en Desarrollo Web (UNER).
El objetivo fue construir una aplicación web client-side completa que simula un portal de gestión de turnos médicos. El proyecto utiliza una API REST pública para la autenticación y simula toda la base de datos de la clínica (médicos, turnos, pacientes, etc.) utilizando la API de LocalStorage como fuente central de datos.

---

## Funcionalidades Destacadas
Este proyecto se divide en dos grandes áreas: el panel de administración sincronizado y el portal dinámico del paciente.

## Panel de Administración (Sincronizado)
Es el núcleo del sistema. Permite la gestión completa de los datos de la clínica, que se persisten en LocalStorage.
Autenticación de Rutas: Protección de todas las vistas de administrador. El acceso se deniega si no existe un token válido en sessionStorage.
CRUDs Completos: Módulos independientes para Crear, Leer, Actualizar y Eliminar (CRUD) Médicos, Especialidades y Obras Sociales.
Base de Datos en LocalStorage: Toda la aplicación comparte una única fuente de verdad (LocalStorage). Los datos se cargan inicialmente desde archivos locales (datos.js, datos-os.js) y luego se gestionan 100% en LocalStorage.
Sincronización en Tiempo Real: (Decisión de diseño clave) El uso de window.addEventListener('storage') permite que los cambios realizados en un panel (ej: eliminar una Obra Social) se reflejen automáticamente y en tiempo real en todas las demás pestañas abiertas (ej: la tabla de Médicos, la vista de Reservas y el catálogo público).

## Portal del Paciente (Dinámico)
Es la cara pública del sitio, construida para ser 100% dinámica.
Catálogo Dinámico: Las cards de especialidades.html y las listas de obras-sociales.html se generan leyendo LocalStorage. Si un administrador elimina un médico, éste desaparece del catálogo público al instante.
Flujo de Turnos Completo:
El Admin crea "Turnos Disponibles" (admin-turnos.html).
El Paciente ve un formulario de filtros en cascada (turnos.html) que carga dinámicamente las especialidades y médicos desde LocalStorage.
Al seleccionar un médico, se filtran y muestran solo sus turnos disponibles.
Al reservar, el turno se actualiza en LocalStorage a "Confirmado" y se le asignan los datos del paciente (Nombre, DNI).
El Admin ve la reserva confirmada en el panel admin-reservas.html.
Formulario de Contacto Validado: La página contacto.html utiliza contacto.js para validar los campos y simular un envío exitoso (setTimeout), mejorando la experiencia de usuario.

---

## Tecnologías Utilizadas
HTML5: Estructura semántica del sitio.
CSS3: Estilos personalizados, animaciones y diseño responsivo (Flexbox, Grid).
JavaScript (ES6+): Programación de toda la lógica, manipulación del DOM y modularización (import/export).
LocalStorage API: Utilizada como base de datos principal client-side para persistir todos los datos de la aplicación.
Bootstrap 5: Framework principal para el layout, componentes (modales, tablas, formularios) y diseño responsivo.
Fetch API: Utilizada para consumir la API REST pública de autenticación.
Git y GitHub: Control de versiones y trabajo colaborativo.
---

## Cómo Ejecutar el Proyecto
1- Clonar este repositorio:
git clone https://github.com/martinmorondo/IDW_60
2- Navegar a la carpeta del proyecto.
3- Importante: Usar un Servidor Local Este proyecto utiliza Módulos de JavaScript (import/export), por lo que no funcionará si se abre el index.html directamente (file:///).
Se recomienda usar un servidor local. La forma más fácil es con la extensión Live Server de Visual Studio Code:
Hacer clic derecho sobre index.html (o la página que quieras ver).
Seleccionar Open with Live Server.
4- Navegar a login.html para iniciar sesión y acceder a los paneles de administración.

## Integrantes del grupo
- Gabriela de los Ángeles Camacho  
- Griselda Eggs  
- Dylan Morales  
- Martín Morondo

---

## Video explicativo

...

---

## Información institucional
Materia: Introducción al Desarrollo Web  
Carrera: Tecnicatura Universitaria en Desarrollo Web  
Facultad: Facultad de Ciencias de la Administración - UNER  
Año: 2025




