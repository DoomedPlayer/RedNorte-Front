# Red Norte - Portal del Paciente 

Este repositorio contiene el código fuente del frontend del Portal del Paciente de Red Norte. Se trata de una aplicación de una sola página basada en React y desarrollada con TypeScript, diseñada para mostrar la información del paciente y sus citas médicas programadas.

## Descripción general

La aplicación proporciona una interfaz intuitiva para los pacientes del sistema médico "Red Norte". Recupera y muestra los datos del paciente, incluyendo información personal y una lista de sus citas médicas. El proyecto utiliza una arquitectura frontend moderna con una clara separación de responsabilidades, empleando el patrón ViewModel mediante React Hooks personalizados para la gestión del estado y la lógica de negocio.

### Características principales
* **Panel del paciente**: Muestra el nombre completo del paciente, el RUT y la información de contacto.
* **Lista de citas**: Muestra todas las citas programadas del paciente.

* **Detalles de la cita**: Cada ficha de cita muestra la especialidad médica, la fecha, la hora, la ubicación (`Box`) y el estado actual (p. ej., PROGRAMADA).

* **Diseño adaptable**: Una interfaz de usuario limpia y profesional, diseñada para un portal médico.

## Tecnologías utilizadas
* **Framework**: React
* **Lenguaje**: TypeScript y JavaScript
* **Configuración del proyecto**: Create React App
* **Arquitectura**: La aplicación sigue una arquitectura basada en componentes con un patrón ViewModel. Se utilizan hooks personalizados (p. ej., `useHospitalViewModel`) para gestionar el estado y la lógica de las vistas.

* **Estilo**: CSS personalizado con variables para un tema consistente (`RedNorte.css`).

## Estructura del proyecto
El código fuente está organizado para mantener una clara separación de responsabilidades:

```
src/
├── components/ # Componentes reutilizables de React (CitaCard, PacienteInfo)
├── models/ # Interfaces TypeScript para estructuras de datos (Paciente, Cita)
├── viewmodels/ # Hooks personalizados que actúan como ViewModels para el estado y la lógica
├── views/ # Vistas/páginas principales de la aplicación (PortalHospital)
├── App.tsx # Componente y diseño principal de la aplicación
└── index.js # Punto de entrada de la aplicación
```

## Primeros pasos

Para ejecutar este proyecto localmente, necesitarás tener Node.js y npm instalados.

1. **Clonar el repositorio:**

```sh

git clone https://github.com/doomedplayer/rednorte-front.git

```

2. **Navegar al directorio del proyecto:**

```sh

cd rednorte-front

```

3. **Instalar dependencias:**

```sh

npm install

```

## Scripts disponibles

En el directorio del proyecto, puedes ejecutar:

### `npm start`

Ejecuta la aplicación en modo de desarrollo.
Abre (http://localhost:3000) para verla en tu navegador.

La página se recargará al realizar cambios. También puedes ver errores de lint en la consola.

### `npm test`

Inicia el ejecutor de pruebas en modo interactivo. Esto te permite ejecutar pruebas y ver los resultados a medida que realizas cambios en el código.

### `npm run build`

Compila la aplicación para producción en la carpeta `build`.
Empaqueta correctamente React en modo producción y optimiza la compilación para obtener el mejor rendimiento. La compilación se minimiza y los nombres de archivo incluyen hashes. Tu aplicación está lista para desplegarse.
