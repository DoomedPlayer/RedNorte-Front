import { useState, useEffect } from 'react';
import { fetchPatientByRut } from '../services/api'; // Ya con la ruta 'services' corregida

export const useDashboardVM = (rut) => {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getPatientData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchPatientByRut(rut);
                setPatient(data);
            } catch (err) {
                console.error("Error en el ViewModel:", err);
                setError(err.message || "No se pudo obtener la información del paciente.");
            } finally {
                setLoading(false);
            }
        };

        if (rut) {
            getPatientData();
        }
    }, [rut]);

    return {
        patient,
        loading,
        error
    };
};