import { useState, useEffect } from 'react';
import api from '../api';

export const useDashboardVM = (rut) => {
    // Ahora 'dashboardData' contendrá el objeto gigante que armaste en el BFF
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await api.get('/api/v1/bff/dashboard');
                
                setDashboardData(response.data);
            } catch (err) {
                console.error("Error obteniendo datos del BFF:", err);
                setError("No se pudo cargar su información. Verifique su conexión.");
            } finally {
                setLoading(false);
            }
        };

        getDashboardData();
    }, []);

    return {
        dashboardData,
        loading,
        error
    };
};