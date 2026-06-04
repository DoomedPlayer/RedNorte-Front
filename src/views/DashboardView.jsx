import React from 'react';
import { useDashboardVM } from '../viewmodels/useDashboardVM';

export default function DashboardView() {
    // 1. Consumimos el ViewModel pasando el RUT de prueba
    const { patient, loading, error } = useDashboardVM('12345678-9');

    // 2. Funciones interactivas (Preparadas para conectarse al backend)
    const handleAgendarHora = () => {
        alert("Abriendo módulo de agendamiento... (Aquí conectaremos la mutación/petición POST)");
        // Aquí irá la lógica para insertar una nueva fila en la base de datos
    };

    const handleAnularHora = (idCita) => {
        const confirmar = window.confirm(`¿Está seguro de que desea anular la cita médica N° ${idCita}?`);
        if (confirmar) {
            alert("Procesando anulación... (Aquí conectaremos la petición DELETE o PUT)");
            // Aquí irá la lógica para cambiar el estado o eliminar de la base de datos
        }
    };

    const handleTelemedicina = () => {
        alert("Redirigiendo a la sala virtual de Fonendo / Teams institucional...");
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px', fontFamily: 'sans-serif', color: '#0056b3' }}>
                <h3>Cargando Portal Clínico RedNorte...</h3>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ color: 'red', textAlign: 'center', padding: '100px', fontFamily: 'sans-serif' }}>
                <h3>Error de Conexión</h3>
                <p>{error}</p>
                <small>Asegúrate de que tu microservicio de Spring Boot en el puerto 8084 esté encendido.</small>
            </div>
        );
    }

    return (
        <div className="dashboard-container" style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '10px 20px 40px 20px' }}>
            
            {/* BANNER PRINCIPAL */}
            <div style={{ backgroundColor: '#0056b3', color: 'white', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '8px', maxWidth: '1100px', margin: '20px auto' }}>
                <div style={{ backgroundColor: 'white', color: '#0056b3', padding: '10px', borderRadius: '4px', fontWeight: 'bold' }}>
                    🏥 REDNORTE
                </div>
                <h1 style={{ margin: 0, fontSize: '24px' }}>Portal del Paciente</h1>
                <span style={{ fontSize: '13px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px' }}>Caso de Estudio DuocUC</span>
            </div>

            {/* CONTENEDOR EN DOS COLUMNAS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 2fr', gap: '20px', maxWidth: '1100px', margin: '0 auto' }}>
                
                {/* COLUMNA IZQUIERDA: PERFIL, CONTACTO Y LISTA DE ESPERA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Tarjeta de Identidad y Contacto de Emergencia */}
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '25px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#0056b3', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>
                            {patient?.nombreCompleto?.charAt(0) || 'P'}
                        </div>
                        <h3 style={{ color: '#333', margin: '0 0 5px 0' }}>{patient?.nombreCompleto}</h3>
                        <span style={{ color: '#777', fontSize: '13px', display: 'block', marginBottom: '15px' }}>RUT: {patient?.rut}</span>
                        
                        <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', marginBottom: '15px' }}>
                            <small style={{ color: '#888', fontWeight: 'bold', display: 'block', fontSize: '10px', marginBottom: '3px' }}>CONTACTO DIRECTO</small>
                            <span style={{ color: '#555', fontSize: '13px' }}>{patient?.correo}</span>
                        </div>

                        {/* Información de Contacto de Emergencia sugerido */}
                        <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', backgroundColor: '#fff9db', padding: '10px', borderRadius: '6px' }}>
                            <small style={{ color: '#b78103', fontWeight: 'bold', display: 'block', fontSize: '10px', marginBottom: '3px' }}>📞 EN CASO DE EMERGENCIA</small>
                            <span style={{ color: '#333', fontSize: '13px', fontWeight: 'bold', display: 'block' }}>María Carmen (Esposa)</span>
                            <span style={{ color: '#555', fontSize: '13px' }}>+56 9 8765 4321</span>
                        </div>
                    </div>

                    {/* Módulo Lista de Espera No Quirúrgica / Garantías GES */}
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '25px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <h4 style={{ margin: '0 0 15px 0', color: '#0056b3', borderBottom: '2px solid #f4f6f9', paddingBottom: '8px' }}>📋 Prioridad Sanitaria</h4>
                        
                        <div style={{ marginBottom: '12px' }}>
                            <small style={{ color: '#888', display: 'block', fontSize: '10px', fontWeight: 'bold' }}>ESTADO ACTUAL</small>
                            <span style={{ color: 'white', backgroundColor: '#ff9800', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', display: 'inline-block', marginTop: '5px' }}>
                                {patient?.estadoListaEspera || 'Pendiente de asignación médica'}
                            </span>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <small style={{ color: '#888', display: 'block', fontSize: '10px', fontWeight: 'bold' }}>FECHA INGRESO A LISTA</small>
                            <span style={{ color: '#333', fontSize: '13px' }}>14-04-2026</span>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <small style={{ color: '#888', display: 'block', fontSize: '10px', fontWeight: 'bold' }}>PRIORIDAD ASIGNADA</small>
                            <span style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '13px' }}>Media - Alta</span>
                        </div>

                        <div style={{ backgroundColor: '#e8f5e9', padding: '8px 12px', borderRadius: '6px', borderLeft: '4px solid #2e7d32' }}>
                            <small style={{ color: '#2e7d32', fontWeight: 'bold', display: 'block', fontSize: '10px' }}>COBERTURA LEGAL</small>
                            <span style={{ color: '#1b5e20', fontSize: '12px', fontWeight: 'bold' }}>Patología bajo Garantía GES/AUGE</span>
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA: ACCIONES, CITAS Y DOCUMENTOS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* BOTONERA ACCIONES RÁPIDAS (Próximamente funcionales) */}
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px 30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <button onClick={handleAgendarHora} style={{ backgroundColor: '#0056b3', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', flex: '1', minWidth: '150px' }}>
                            ➕ Agendar Nueva Hora
                        </button>
                        <button onClick={handleTelemedicina} style={{ backgroundColor: '#2ed573', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', flex: '1', minWidth: '150px' }}>
                            💻 Ir a Sala Virtual (Tele)
                        </button>
                    </div>
                    
                    {/* SECCIÓN: CITAS MÉDICAS PROGRAMADAS */}
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>📅 Próximas Citas Médicas</h3>
                        
                        {/* Cita de Ejemplo */}
                        <div style={{ backgroundColor: '#f8f9fa', borderRadius: '6px', padding: '20px', borderLeft: '4px solid #00a8ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>Cardiología - Control</h4>
                                <p style={{ margin: '3px 0', color: '#666', fontSize: '13px' }}>👨‍⚕️ Dr. Alejandro Sanz</p>
                                <p style={{ margin: '3px 0', color: '#888', fontSize: '13px' }}>📅 20-05-2026, 10:00 a. m. | 📍 Box A-12</p>
                            </div>
                            <button 
                                onClick={() => handleAnularHora(101)} 
                                style={{ backgroundColor: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                            >
                                Anular Hora
                            </button>
                        </div>
                    </div>

                    {/* SECCIÓN: DOCUMENTOS CLÍNICOS (Estáticos según lo acordado) */}
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>📄 Recetas y Exámenes Disponibles</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', border: '1px solid #eee', borderRadius: '6px' }}>
                                <div>
                                    <span style={{ fontWeight: 'bold', display: 'block', fontSize: '13px', color: '#333' }}>Receta Médica Electrónica - Tratamiento Crónico</span>
                                    <small style={{ color: '#aaa' }}>Emitido por Cardiología el 01-06-2026</small>
                                </div>
                                <span style={{ color: '#0056b3', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#e8f0fe', padding: '4px 8px', borderRadius: '4px' }}>Estático (PDF)</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', border: '1px solid #eee', borderRadius: '6px' }}>
                                <div>
                                    <span style={{ fontWeight: 'bold', display: 'block', fontSize: '13px', color: '#333' }}>Resultado de Examen: Hemograma Completo</span>
                                    <small style={{ color: '#aaa' }}>Laboratorio Clínico RedNorte</small>
                                </div>
                                <span style={{ color: '#0056b3', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#e8f0fe', padding: '4px 8px', borderRadius: '4px' }}>Estático (PDF)</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* PIE DE PÁGINA */}
            <div style={{ textAlign: 'center', color: '#888', fontSize: '12px', marginTop: '40px' }}>
                © 2026 Red Norte Salud - Examen Transversal • Duoc UC
            </div>
        </div>
    );
}