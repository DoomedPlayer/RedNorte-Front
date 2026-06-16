const BASE_URL = 'http://localhost:8084/api/v1/portal'; // Conexión directa al microservicio bypassendo el gateway temporalmente

export const fetchPatientByRut = async (rut) => {
    try {
        const response = await fetch(`${BASE_URL}/pacientes/${rut}`);
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al conectar con el Backend:", error);
        throw error;
    }
};