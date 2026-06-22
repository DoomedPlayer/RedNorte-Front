import React, { useState } from 'react';
import { useDashboardVM } from '../viewmodels/useDashboardVM';
import { AgendarModal } from '../components/AgendarModal';
import api from '../api';

export default function DashboardView() {
    const { dashboardData, loading, error, refreshDashboard } = useDashboardVM();
    
    const patient = {
        nombreCompleto: dashboardData?.nombreCompleto,
        rut: dashboardData?.rut,
        correo: dashboardData?.email,
        contactoEmergenciaNombre: dashboardData?.contactoEmergenciaNombre,
        contactoEmergenciaParentesco: dashboardData?.contactoEmergenciaParentesco,
        contactoEmergenciaTelefono: dashboardData?.contactoEmergenciaTelefono
    };

    const listaEspera = {
        estado: dashboardData?.estadoActual,
        fechaRegistro: dashboardData?.fechaIngresoLista,
        prioridad: dashboardData?.prioridadAsignada,
        gesAuge: dashboardData?.tieneCoberturaGesAuge
    };

    const citas = dashboardData?.proximasCitas || [];
    const documentos = dashboardData?.recetasYExamenes || [];

    const proximasCitas = citas.filter(c => c.estado !== 'CANCELADA');
    const historialCitas = citas.filter(c => c.estado === 'CANCELADA' || 
    c.estado === 'PRESENTE' || 
    c.estado === 'ASISTIDA' ||
    c.estado === 'FINALIZADA'
);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [citaAnulada, setCitaAnulada] = useState(false);
    const [activeTab, setActiveTab] = useState('proximas');

    const handleAgendarHora = () => {
        setIsModalOpen(true);
    };

    // Conexión real al API Gateway -> Waitlist-Service
    const handleConfirmarReserva = async (datosReserva) => {
        const payloadBackend = {
            rutPaciente: patient?.rut,
            idEspecialidad: datosReserva.idEspecialidad,
            tipoAtencion: datosReserva.tipoAtencion,
            gesAuge: false
        };
        
        try {
            const response = await api.post('/api/espera/registrar', payloadBackend);
            
            console.log("Guardado en BD:", response.data);
            alert(`¡Éxito! Solicitud ingresada a la lista de espera.\nPrioridad: Nivel ${response.data.nivelPrioridad}`);
            setIsModalOpen(false); 
            // Opcional: Aquí podrías forzar una recarga del dashboard para actualizar la vista
            
        } catch (err) {
            console.error("Error de conexión:", err);
            alert("No se pudo conectar con el servidor.");
        }
    };

    const handleAnularHora = async (idCita) => {
        if (!idCita) {
            console.error("ID de cita inválido");
            return;
        }

        const confirmar = window.confirm(`¿Está seguro de que desea anular esta cita?`);
        if (confirmar) {
            try {
                // Aquí la ruta se construirá correctamente como /api/citas/123/cancelar
                await api.post(`/api/citas/${idCita}/cancelar`); 
                alert("Cita anulada exitosamente.");
                await refreshDashboard();
            } catch (error) {
                console.error(error);
                alert("Error al anular la cita.");
            }
        }
    };

    const handleDescargarPDF = (nombreDoc) => {
        alert(`Generando documento seguro: ${nombreDoc}...\nLa descarga comenzará en breve.`);
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
            <div style={{ textAlign: 'center', padding: '100px', fontFamily: 'sans-serif', color: 'red' }}>
                <h3>{error}</h3>
            </div>
        );
    }

    return (
        <div className="dashboard-container" style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '10px 20px 40px 20px' }}>
            
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
                        <h3 style={{ color: '#333', margin: '0 0 5px 0' }}>{patient?.nombreCompleto || 'Usuario sin nombre'}</h3>
                        <span style={{ color: '#777', fontSize: '13px', display: 'block', marginBottom: '15px' }}>RUT: {patient?.rut || 'Sin RUT'}</span>
                        
                        <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', marginBottom: '15px' }}>
                            <small style={{ color: '#888', fontWeight: 'bold', display: 'block', fontSize: '10px', marginBottom: '3px' }}>CONTACTO DIRECTO</small>
                            <span style={{ color: '#555', fontSize: '13px' }}>{patient?.correo || 'Sin correo registrado'}</span>
                        </div>

                        {/* Datos de emergencia (Si tu backend no los manda aún, no se mostrarán) */}
                        {patient?.contactoEmergenciaNombre && (
                            <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', backgroundColor: '#fff9db', padding: '10px', borderRadius: '6px' }}>
                                <small style={{ color: '#b78103', fontWeight: 'bold', display: 'block', fontSize: '10px', marginBottom: '3px' }}>📞 EN CASO DE EMERGENCIA</small>
                                <span style={{ color: '#333', fontSize: '13px', fontWeight: 'bold', display: 'block' }}>{patient.contactoEmergenciaNombre} ({patient.contactoEmergenciaParentesco})</span>
                                <span style={{ color: '#555', fontSize: '13px' }}>{patient.contactoEmergenciaTelefono}</span>
                            </div>
                        )}
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '25px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <h4 style={{ margin: '0 0 15px 0', color: '#0056b3', borderBottom: '2px solid #f4f6f9', paddingBottom: '8px' }}>📋 Prioridad Sanitaria</h4>
                        {listaEspera && listaEspera.estado !== 'Sin registros' ? (
                        <>
                            <div style={{ marginBottom: '12px' }}>
                                <small>ESTADO ACTUAL</small>
                                <span style={{ display: 'block', fontWeight: 'bold' }}>{listaEspera.estado || listaEspera.estadoFrontend}</span>
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <small>FECHA INGRESO A LISTA</small>
                                <span style={{ display: 'block' }}>{listaEspera.fechaFormateada || listaEspera.fechaRegistro || '-'}</span>
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <small>PRIORIDAD ASIGNADA</small>
                                <span style={{ display: 'block' }}>{listaEspera.textoPrioridad || listaEspera.prioridad || '-'}</span>
                            </div>
                            
                            {listaEspera.gesAuge && (
                                <div style={{ backgroundColor: '#e8f5e9', padding: '8px 12px', borderRadius: '6px', borderLeft: '4px solid #2e7d32' }}>
                                    <small style={{ color: '#2e7d32' }}>COBERTURA LEGAL</small>
                                    <span style={{ color: '#1b5e20' }}>Patología bajo Garantía GES/AUGE</span>
                                </div>
                            )}
                        </>
                    ) : (
                        <p style={{ color: '#777', fontSize: '14px' }}>No se encuentra en lista de espera actualmente.</p>
                    )}
                    </div>
                </div>

                {/* COLUMNA DERECHA: ACCIONES Y PESTAÑAS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* BOTONERA ACCIONES RÁPIDAS MODIFICADA */}
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px 30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <button onClick={handleAgendarHora} style={{ backgroundColor: '#0056b3', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', flex: '1', minWidth: '150px' }}>
                            ➕ Agendar Nueva Hora
                        </button>
                    </div>
                    
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
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

                        <div style={{ padding: '30px' }}>
                            {activeTab === 'proximas' && (
                                <div>
                                    <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Horas Médicas Programadas</h3>
                                    
                                    {proximasCitas.length === 0 ? (
                                        <p style={{ color: '#777' }}>No tienes citas médicas programadas.</p>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                            {proximasCitas.map((cita) => {
                                                const isAnulada = cita.estado === 'CANCELADA';
                                                console.log("DEBUG LISTA ESPERA:", dashboardData?.estadoActual, dashboardData?.prioridadAsignada);
                                                return (
                                                    <div key={cita.id} style={{ 
                                                        backgroundColor: isAnulada ? '#fcfcfc' : '#f8f9fa', 
                                                        borderRadius: '6px', 
                                                        padding: '20px', 
                                                        borderLeft: isAnulada ? '4px solid #dc3545' : '4px solid #28a745', 
                                                        display: 'flex', 
                                                        justifyContent: 'space-between', 
                                                        alignItems: 'center', 
                                                        opacity: isAnulada ? 0.6 : 1,
                                                        border: '1px solid #eee'
                                                    }}>
                                                        <div>
                                                            <h4 style={{ margin: '0 0 5px 0', color: isAnulada ? '#777' : '#333', textDecoration: isAnulada ? 'line-through' : 'none' }}>
                                                                {cita.especialidadYTipo || 'Consulta Especialidad'} 
                                                            </h4>
                                                            <p style={{ margin: '3px 0', color: '#666', fontSize: '13px' }}>👨‍⚕️ {cita.medico || 'Médico Asignado'}</p>
                                                            <p style={{ margin: '3px 0', color: '#888', fontSize: '13px' }}>📅 {cita.fechaHora || cita.fecha} | 📍 {cita.lugar || 'Por confirmar'}</p>
                                                            {isAnulada && <span style={{ color: '#dc3545', fontSize: '12px', fontWeight: 'bold' }}>CITA ANULADA</span>}
                                                        </div>
                                                        
                                                        {/* INDICADOR VISUAL Y ACCIÓN */}
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                            {!isAnulada && (
                                                                <button 
                                                                    onClick={() => handleAnularHora(cita.id)}
                                                                    style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                                                                >
                                                                    Anular
                                                                </button>
                                                            )}
                                                            <div style={{ 
                                                                backgroundColor: isAnulada ? '#f8d7da' : '#e8f5e9', 
                                                                padding: '10px', 
                                                                borderRadius: '50%', 
                                                                display: 'flex', 
                                                                justifyContent: 'center', 
                                                                alignItems: 'center', 
                                                                width: '25px', 
                                                                height: '25px' 
                                                            }}>
                                                                {isAnulada ? (
                                                                    <span style={{ color: '#dc3545', fontSize: '16px', fontWeight: 'bold' }} title="Anulada">✖</span>
                                                                ) : (
                                                                    <span style={{ color: '#28a745', fontSize: '16px', fontWeight: 'bold' }} title="Confirmada">✔</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'historial' && (
                                <div>
                                    <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Historial de Atenciones</h3>
                                    {historialCitas.length === 0 ? (
                                        <p style={{ color: '#777' }}>No tienes citas anuladas en tu historial.</p>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                            {historialCitas.map((cita) => {
                                                const isPresente = cita.estado === 'PRESENTE' || cita.estado === 'ASISTIDA';
                                                const colorBorde = isPresente ? '#28a745' : '#dc3545';
                                                const colorFondo = isPresente ? '#e8f5e9' : '#fff5f5';

                                                return (
                                                    <div key={cita.id} style={{ backgroundColor: colorFondo, borderLeft: `5px solid ${colorBorde}`, borderRadius: '6px', padding: '15px', display: 'flex', justifyContent: 'space-between' }}>
                                                        <div>
                                                            <h4 style={{ margin: '0' }}>{cita.especialidadYTipo}</h4>
                                                            <p style={{ margin: '3px 0', fontSize: '12px', color: '#666' }}>Fecha: {cita.fechaHora}</p>
                                                        </div>
                                                        <span style={{ 
                                                            color: isPresente ? '#28a745' : '#dc3545', 
                                                            fontWeight: 'bold', 
                                                            padding: '5px 10px', 
                                                            borderRadius: '4px',
                                                            fontSize: '12px' 
                                                        }}>
                                                            {isPresente ? '✔ ATENDIDO' : '✖ CANCELADO'}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>📄 Recetas y Exámenes Disponibles</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {documentos.length === 0 ? (
                                <p style={{ color: '#777', fontSize: '14px' }}>No hay documentos registrados para este paciente.</p>
                            ) : (
                                documentos.map((doc, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', border: '1px solid #eee', borderRadius: '6px' }}>
                                        <div>
                                            <span style={{ fontWeight: 'bold', display: 'block', fontSize: '13px', color: '#333' }}>{doc.tipo} - {doc.descripcion}</span>
                                            <small style={{ color: '#aaa' }}>{doc.fecha || 'Fecha no disponible'}</small>
                                        </div>
                                        <button onClick={() => handleDescargarPDF(`${doc.tipo}.pdf`)} style={{ color: '#0056b3', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#e8f0fe', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                                            Descargar PDF
                                        </button>
                                    </div>
                                ))
                            )}
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