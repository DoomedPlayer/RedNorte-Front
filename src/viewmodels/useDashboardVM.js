import { useState, useEffect } from 'react';
import api from '../api';

export const useDashboardVM = (rut) => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/bff/dashboard');
            setDashboardData(response.data);
        } catch (err) {
            setError("Error al cargar datos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { dashboardData, loading, error, refreshDashboard: fetchData };
};