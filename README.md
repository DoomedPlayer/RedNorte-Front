# 🏥 Red Norte - Frontend

Aplicación web desarrollada con React para el sistema Red Norte. Este proyecto implementa la interfaz de usuario del portal clínico, permitiendo la interacción entre pacientes y profesionales de la salud mediante una experiencia simple e intuitiva.

El frontend consume los servicios expuestos por el backend para mostrar información clínica, gestionar usuarios y visualizar la información médica disponible.

---

## Características

Entre las principales funcionalidades implementadas se encuentran:

- Inicio de sesión para pacientes y médicos.
- Registro de nuevos usuarios.
- Panel principal del paciente.
- Panel de trabajo para médicos.
- Visualización de citas médicas.
- Agendamiento de nuevas horas mediante ventana modal.
- Consulta del historial y documentos médicos.
- Consumo de servicios REST para obtener información desde el backend.
- Soporte para datos de ejemplo cuando los servicios no están disponibles.

---

## Tecnologías utilizadas

| Tecnología | Uso |
|------------|-----|
| React 19 | Desarrollo de la interfaz |
| JavaScript | Lógica de la aplicación |
| CSS3 | Diseño y estilos |
| Fetch API | Consumo de servicios REST |
| SweetAlert2 | Alertas y mensajes interactivos |
| Create React App | Configuración del proyecto |

---

## Arquitectura

La aplicación sigue una organización inspirada en el patrón **MVVM (Model - View - ViewModel)**.

Cada capa posee una responsabilidad específica:

- **Views:** representan las pantallas visibles para el usuario.
- **Components:** contienen componentes reutilizables utilizados por distintas vistas.
- **ViewModels:** administran el estado de la aplicación y la comunicación con los servicios.
- **Services:** encapsulan las llamadas HTTP hacia el backend.
- **Models:** definen las estructuras de datos utilizadas dentro de la aplicación.

Esta distribución facilita el mantenimiento del código y evita mezclar la lógica de negocio con la presentación.

---

## Organización del proyecto

```text
src/
│
├── assets/
│   ├── App.css
│   ├── dashboard.css
│   └── index.css
│
├── components/
│   ├── AgendaModal.jsx
│   ├── CitaCard.tsx
│   ├── PacienteInfo.tsx
│   ├── PatientCrudModal.jsx
│   └── StatusCard.jsx
│
├── models/
│   ├── hospitalModels.ts
│   └── Patient.js
│
├── services/
│   └── api.js
│
├── viewmodels/
│   ├── useAuthVM.js
│   ├── useDashboardVM.js
│   └── useHospitalModels.ts
│
├── views/
│   ├── DashboardView.jsx
│   ├── DoctorDashboard.jsx
│   ├── LoginDoctor.jsx
│   ├── LoginUsuario.jsx
│   ├── PortalHospital.tsx
│   └── RegistroUsuario.jsx
│
├── App.js
└── index.js
```

---

## Comunicación con el backend

Las solicitudes al backend se encuentran centralizadas dentro de la carpeta **services**.

Actualmente el proyecto consume los endpoints REST utilizando **Fetch API**, permitiendo obtener información como:

- Datos del paciente.
- Información médica.
- Citas agendadas.

---

## Instalación

Clonar el repositorio

```bash
git clone https://github.com/doomedplayer/rednorte-front.git
```

Ingresar al proyecto

```bash
cd rednorte-front
```

Instalar dependencias

```bash
npm install
```

---

## Ejecución

Iniciar el servidor de desarrollo

```bash
npm start
```

La aplicación estará disponible en:

```text
http://localhost:3000
```

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| npm start | Ejecuta la aplicación en modo desarrollo. |
| npm test | Ejecuta las pruebas disponibles del proyecto. |
| npm run build | Genera la versión optimizada para producción. |

