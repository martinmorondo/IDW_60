# IDW_60 - Trabajo Final Integrador

## Vita Kids - Sistema de Gestión de Turnos Médicos

### Introducción
Este proyecto es la entrega final integradora de la materia Introducción al Desarrollo Web (2025) de la Tecnicatura Universitaria en Desarrollo Web (UNER).
El objetivo fue construir una aplicación web client-side completa que simula un portal de gestión de turnos médicos. El proyecto utiliza una API REST pública para la autenticación y simula toda la base de datos de la clínica (médicos, turnos, pacientes, etc.) utilizando la API de LocalStorage como fuente central de datos.

---

## Funcionalidades Destacadas

El sistema se divide en dos grandes áreas:

- **Panel de Administración (Sincronizado)**
- **Portal del Paciente (Dinámico)**

---

## Panel de Administración (Sincronizado)

Es el núcleo del sistema. Permite la gestión completa de los datos de la clínica, que se persisten en **LocalStorage**.

### Funcionalidades principales:

- **Autenticación de rutas**  
  Todas las vistas del administrador están protegidas. El acceso se deniega si no existe un token válido en `sessionStorage`.

- **CRUDs completos**  
  Módulos independientes para:
  - Crear, Leer, Actualizar y Eliminar (**CRUD**) Médicos  
  - Crear, Leer, Actualizar y Eliminar Especialidades  
  - Crear, Leer, Actualizar y Eliminar Obras Sociales

- **Base de datos centralizada en LocalStorage**  
  Toda la aplicación comparte una única fuente de verdad (**LocalStorage**).  
  Los datos se cargan inicialmente desde archivos locales (`datos.js`, `datos-os.js`) y luego se gestionan 100% en LocalStorage.

- **Sincronización en tiempo real**  
  Gracias a `window.addEventListener('storage')`, los cambios realizados en una pestaña (por ejemplo, eliminar una Obra Social) se reflejan automáticamente y en tiempo real en:
  - La tabla de Médicos  
  - La vista de Reservas  
  - El catálogo público

---

## Portal del Paciente (Dinámico)

Es la cara pública del sitio, construida para ser 100% dinámica.

### Características principales:

- **Catálogo dinámico**  
  Las cards de `especialidades.html` y las listas de `obras-sociales.html` se generan leyendo LocalStorage.  
  Si un administrador elimina un médico, este desaparece del catálogo público al instante.

- **Flujo completo de turnos**
  1. El administrador crea "Turnos Disponibles" desde `admin-turnos.html`.  
  2. El paciente utiliza un formulario de filtros en cascada (`turnos.html`) que carga dinámicamente las especialidades y médicos desde LocalStorage.  
  3. Al seleccionar un médico, se filtran y muestran solo sus turnos disponibles.  
  4. Al reservar, el turno se actualiza a **Confirmado** y se le asignan los datos del paciente (Nombre, DNI).  
  5. El administrador ve la reserva confirmada en `admin-reservas.html`.

- **Formulario de contacto validado**  
  La página `contacto.html` utiliza `contacto.js` para validar los campos y simular un envío exitoso mediante `setTimeout`, mejorando la experiencia del usuario.

---

## Tecnologías Utilizadas

- **HTML5** – Estructura semántica del sitio  
- **CSS3** – Estilos personalizados, animaciones y diseño responsivo (Flexbox, Grid)  
- **JavaScript (ES6+)** – Lógica completa, manipulación del DOM y modularización (import/export)  
- **LocalStorage API** – Base de datos principal client-side  
- **Bootstrap 5** – Layout, componentes (modales, tablas, formularios) y diseño responsivo  
- **Fetch API** – Consumo de API REST pública de autenticación  
- **Git y GitHub** – Control de versiones y trabajo colaborativo

---

## Cómo Ejecutar el Proyecto

1. **Clonar el repositorio:**  
   git clone https://github.com/martinmorondo/IDW_60
   
2. Navegar a la carpeta del proyecto.

3. Importante: usar un servidor local
Este proyecto utiliza módulos de JavaScript (import/export), por lo que no funcionará si se abre index.html directamente con file:///.
La forma más fácil de ejecutarlo es con la extensión Live Server de Visual Studio Code:
Hacer clic derecho sobre index.html (o cualquier página que quieras abrir)
Seleccionar Open with Live Server

4. Ingresar al panel de administración
Abrir login.html para iniciar sesión y acceder a los paneles.

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




