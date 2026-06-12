import React, { useState } from 'react';
import { useDashboardVM } from '../viewmodels/useDashboardVM';
import { AgendarModal } from '../components/AgendarModal';

export default function DashboardView() {
    const { patient, loading, error } = useDashboardVM('12345678-9');
    
    // Estados de la interfaz
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [citaAnulada, setCitaAnulada] = useState(false);
    
    // ESTADO DE PESTAÑAS: Controla si vemos las citas futuras o el historial
    const [activeTab, setActiveTab] = useState('proximas');

    const handleAgendarHora = () => {
        setIsModalOpen(true);
    };

    const handleConfirmarReserva = (datosReserva) => {
        const payloadBackend = {
            rutPaciente: patient?.rut || '12345678-9',
            idEspecialidad: datosReserva.idEspecialidad,
            tipoAtencion: datosReserva.tipoAtencion
        };
        
        console.log("Simulando envío al backend (Spring Boot):", payloadBackend);
        alert("¡Su solicitud ha sido ingresada exitosamente a la lista de espera de RedNorte!");
        setIsModalOpen(false); 
    };

    const handleAnularHora = (idCita) => {
        const confirmar = window.confirm(`¿Está seguro de que desea anular la cita médica N° ${idCita}?`);
        if (confirmar) {
            setCitaAnulada(true); 
            alert("La cita ha sido liberada exitosamente.");
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

    return (
        <div className="dashboard-container" style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '10px 20px 40px 20px' }}>
            
            {error && (
                <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '10px', textAlign: 'center', marginBottom: '15px', borderRadius: '4px', fontSize: '14px' }}>
                    ⚠️ Modo de interfaz: Backend no detectado. Se están usando datos de muestra para el diseño.
                </div>
            )}

            <AgendarModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onConfirm={handleConfirmarReserva} 
            />

            {/* BANNER PRINCIPAL */}
            <div style={{ backgroundColor: '#0056b3', color: 'white', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '8px', maxWidth: '1100px', margin: '20px auto' }}>
                <div style={{ backgroundColor: 'white', color: '#0056b3', padding: '10px', borderRadius: '4px', fontWeight: 'bold' }}>
                    🏥 REDNORTE
                </div>
                <h1 style={{ margin: 0, fontSize: '24px' }}>Portal del Paciente</h1>
                <span style={{ fontSize: '13px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px' }}>La salud es importante!</span>
            </div>

            {/* CONTENEDOR EN DOS COLUMNAS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 2fr', gap: '20px', maxWidth: '1100px', margin: '0 auto' }}>
                
                {/* COLUMNA IZQUIERDA: PERFIL Y LISTA DE ESPERA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '25px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#0056b3', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>
                            {patient?.nombreCompleto?.charAt(0) || 'P'}
                        </div>
                        <h3 style={{ color: '#333', margin: '0 0 5px 0' }}>{patient?.nombreCompleto || 'Pedro Pascal Balmaceda'}</h3>
                        <span style={{ color: '#777', fontSize: '13px', display: 'block', marginBottom: '15px' }}>RUT: {patient?.rut || '12345678-9'}</span>
                        
                        <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', marginBottom: '15px' }}>
                            <small style={{ color: '#888', fontWeight: 'bold', display: 'block', fontSize: '10px', marginBottom: '3px' }}>CONTACTO DIRECTO</small>
                            <span style={{ color: '#555', fontSize: '13px' }}>{patient?.correo || 'pedro.pascal@rednorte.cl'}</span>
                        </div>

                        <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', backgroundColor: '#fff9db', padding: '10px', borderRadius: '6px' }}>
                            <small style={{ color: '#b78103', fontWeight: 'bold', display: 'block', fontSize: '10px', marginBottom: '3px' }}>📞 EN CASO DE EMERGENCIA</small>
                            <span style={{ color: '#333', fontSize: '13px', fontWeight: 'bold', display: 'block' }}>María Carmen (Esposa)</span>
                            <span style={{ color: '#555', fontSize: '13px' }}>+56 9 8765 4321</span>
                        </div>
                    </div>

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
                    
                    {/* Botones de acción rápida */}
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px 30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <button onClick={handleAgendarHora} style={{ backgroundColor: '#0056b3', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', flex: '1', minWidth: '150px' }}>
                            ➕ Agendar Nueva Hora
                        </button>
                        <button onClick={handleTelemedicina} style={{ backgroundColor: '#2ed573', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', flex: '1', minWidth: '150px' }}>
                            🎥 Ir a Sala Virtual (Tele)
                        </button>
                    </div>
                    
                    {/* CONTENEDOR DE PESTAÑAS (TABS) PARA CITAS */}
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                        
                        {/* Cabecera de las Pestañas */}
                        <div style={{ display: 'flex', borderBottom: '1px solid #eee', backgroundColor: '#f8f9fa' }}>
                            <button 
                                onClick={() => setActiveTab('proximas')}
                                style={{ flex: '1', padding: '15px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', color: activeTab === 'proximas' ? '#0056b3' : '#777', borderBottom: activeTab === 'proximas' ? '3px solid #0056b3' : '3px solid transparent', transition: 'all 0.2s' }}
                            >
                                📅 Próximas Citas
                            </button>
                            <button 
                                onClick={() => setActiveTab('historial')}
                                style={{ flex: '1', padding: '15px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', color: activeTab === 'historial' ? '#0056b3' : '#777', borderBottom: activeTab === 'historial' ? '3px solid #0056b3' : '3px solid transparent', transition: 'all 0.2s' }}
                            >
                                🗂️ Historial Médico
                            </button>
                        </div>

                        {/* Contenido Dinámico de las Pestañas */}
                        <div style={{ padding: '30px' }}>
                            
                            {/* PESTAÑA: PRÓXIMAS CITAS */}
                            {activeTab === 'proximas' && (
                                <div>
                                    <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Horas Médicas Programadas</h3>
                                    <div style={{ backgroundColor: citaAnulada ? '#f5f5f5' : '#f8f9fa', borderRadius: '6px', padding: '20px', borderLeft: citaAnulada ? '4px solid #9e9e9e' : '4px solid #00a8ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: citaAnulada ? 0.6 : 1 }}>
                                        <div>
                                            <h4 style={{ margin: '0 0 5px 0', color: citaAnulada ? '#777' : '#333', textDecoration: citaAnulada ? 'line-through' : 'none' }}>Cardiología - Control</h4>
                                            <p style={{ margin: '3px 0', color: '#666', fontSize: '13px' }}>👨‍⚕️ Dr. Alejandro Sanz</p>
                                            <p style={{ margin: '3px 0', color: '#888', fontSize: '13px' }}>📅 20-05-2026, 10:00 a. m. | 📍 Box A-12</p>
                                            {citaAnulada && <span style={{ color: '#d32f2f', fontSize: '12px', fontWeight: 'bold' }}>CITA ANULADA POR EL PACIENTE</span>}
                                        </div>
                                        {!citaAnulada && (
                                            <button onClick={() => handleAnularHora(101)} style={{ backgroundColor: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                                                Anular Hora
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* PESTAÑA: HISTORIAL MÉDICO */}
                            {activeTab === 'historial' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Atenciones Anteriores</h3>
                                    
                                    {/* Item de Historial: Realizada */}
                                    <div style={{ backgroundColor: '#fcfcfc', borderRadius: '6px', padding: '15px', borderLeft: '4px solid #2e7d32', border: '1px solid #eee' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <h4 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '14px' }}>Medicina General - Evaluación</h4>
                                                <p style={{ margin: '0', color: '#888', fontSize: '12px' }}>📅 05-02-2026 | Dra. Camila Rojas</p>
                                            </div>
                                            <span style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>✔ Asistió</span>
                                        </div>
                                    </div>

                                    {/* Item de Historial: Inasistencia */}
                                    <div style={{ backgroundColor: '#fcfcfc', borderRadius: '6px', padding: '15px', borderLeft: '4px solid #c62828', border: '1px solid #eee' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <h4 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '14px' }}>Traumatología - Procedimiento</h4>
                                                <p style={{ margin: '0', color: '#888', fontSize: '12px' }}>📅 15-11-2025 | Dr. Luis Torres</p>
                                            </div>
                                            <span style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>✖ No Asistió</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SECCIÓN DOCUMENTOS CLÍNICOS (Siempre Visible Abajo) */}
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>📄 Recetas y Exámenes Disponibles</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', border: '1px solid #eee', borderRadius: '6px' }}>
                                <div>
                                    <span style={{ fontWeight: 'bold', display: 'block', fontSize: '13px', color: '#333' }}>Receta Médica Electrónica - Tratamiento Crónico</span>
                                    <small style={{ color: '#aaa' }}>Emitido por Cardiología el 01-06-2026</small>
                                </div>
                                <span style={{ color: '#0056b3', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#e8f0fe', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Descargar PDF</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', border: '1px solid #eee', borderRadius: '6px' }}>
                                <div>
                                    <span style={{ fontWeight: 'bold', display: 'block', fontSize: '13px', color: '#333' }}>Resultado de Examen: Hemograma Completo</span>
                                    <small style={{ color: '#aaa' }}>Laboratorio Clínico RedNorte</small>
                                </div>
                                <span style={{ color: '#0056b3', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#e8f0fe', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Descargar PDF</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div style={{ textAlign: 'center', color: '#888', fontSize: '12px', marginTop: '40px' }}>
                © 2026 Red Norte Salud
            </div>
        </div>
    );
}