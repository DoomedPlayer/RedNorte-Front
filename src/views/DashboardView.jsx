import React, { useState, useEffect } from 'react';
import { useDashboardVM } from '../viewmodels/useDashboardVM';
import { AgendarModal } from '../components/AgendarModal';

export default function DashboardView() {
    const { patient, loading, error } = useDashboardVM('12345678-9');
    
    // Estados de la interfaz
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [citaAnulada, setCitaAnulada] = useState(false);
    const [activeTab, setActiveTab] = useState('proximas');

    // Estados para edición de perfil
    const [isEditing, setIsEditing] = useState(false);
    const [localEditableData, setLocalEditableData] = useState({
        correo: '',
        direccion: 'Av. Las Condes 1234, Santiago',
        telefono: '+56 9 1234 5678',
        contactoEmergenciaNombre: 'María Carmen (Esposa)',
        contactoEmergenciaTelefono: '+56 9 8765 4321'
    });

    // Sincronizar datos iniciales cuando el ViewModel responda
    useEffect(() => {
        if (patient) {
            setLocalEditableData({
                correo: patient.correo || 'pedro.pascal@rednorte.cl',
                direccion: patient.direccion || 'Av. Las Condes 1234, Santiago',
                telefono: patient.telefono || '+56 9 1234 5678',
                contactoEmergenciaNombre: patient.contactoEmergenciaNombre || 'María Carmen (Esposa)',
                contactoEmergenciaTelefono: patient.contactoEmergenciaTelefono || '+56 9 8765 4321'
            });
        }
    }, [patient]);

    // Manejador de Cierre de Sesión
    const handleLogout = () => {
        const confirmar = window.confirm("¿Está seguro de que desea cerrar su sesión?");
        if (confirmar) {
            // Limpieza de credenciales (Ajusta según uses localStorage, cookies o sessionStorage)
            localStorage.clear();
            sessionStorage.clear();
            
            alert("Sesión cerrada correctamente. Redireccionando...");
            
            // Redirección directa al login (o recarga en su defecto para demostración)
            window.location.href = '/login'; 
        }
    };

    // Manejadores de edición
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocalEditableData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGuardarPerfil = (e) => {
        e.preventDefault();
        setIsEditing(false);
        console.log("Datos de contacto actualizados:", localEditableData);
        alert("¡Datos de contacto actualizados localmente con éxito!");
    };

    // Conexión real al API Gateway -> Waitlist-Service
    const handleConfirmarReserva = async (datosReserva) => {
        const payloadBackend = {
            rutPaciente: patient?.rut || '12345678-9',
            idEspecialidad: datosReserva.idEspecialidad,
            tipoAtencion: datosReserva.tipoAtencion
        };
        
        try {
            const response = await fetch('http://localhost:8080/api/espera/registrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payloadBackend)
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Guardado en BD:", data);
                alert(`¡Éxito! Su solicitud fue ingresada a la lista de espera.\nPrioridad asignada: Nivel ${data.nivelPrioridad}`);
                setIsModalOpen(false); 
            } else {
                alert("Hubo un problema al registrar la solicitud en el servidor.");
            }
        } catch (err) {
            console.error("Error de conexión:", err);
            alert("No se pudo conectar con el servidor.");
        }
    };

    const handleAgendarHora = () => {
        setIsModalOpen(true);
    };

    const handleAnularHora = (idCita) => {
        if (citaAnulada) {
            alert("Esta cita ya se encuentra anulada.");
            return;
        }

        const confirmar = window.confirm(`¿Está seguro de que desea anular su próxima cita médica?`);
        if (confirmar) {
            setCitaAnulada(true); 
            alert("La cita ha sido liberada exitosamente.");
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

    return (
        <div className="dashboard-container" style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '10px 20px 40px 20px' }}>
            
            {error && (
                <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '10px', textAlign: 'center', marginBottom: '15px', borderRadius: '4px', fontSize: '14px' }}>
                    ⚠️ Modo de interfaz: Backend de usuarios no detectado. Se están usando datos de muestra para el diseño.
                </div>
            )}

            <AgendarModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onConfirm={handleConfirmarReserva} 
            />

            {/* BANNER PRINCIPAL CON BOTÓN DE CERRAR SESIÓN */}
            <div style={{ backgroundColor: '#0056b3', color: 'white', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '8px', maxWidth: '1100px', margin: '20px auto' }}>
                <div style={{ backgroundColor: 'white', color: '#0056b3', padding: '10px', borderRadius: '4px', fontWeight: 'bold' }}>
                    🏥 REDNORTE
                </div>
                <h1 style={{ margin: 0, fontSize: '24px' }}>Portal del Paciente</h1>
                
                {/* REEMPLAZO INTERACTIVO DE "LA SALUD ES IMPORTANTE!" */}
                <button 
                    onClick={handleLogout}
                    style={{ 
                        fontSize: '13px', 
                        backgroundColor: '#dc3545', 
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px', 
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'background-color 0.2s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#bd2130'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                >
                    🚪 Cerrar Sesión
                </button>
            </div>

            {/* CONTENEDOR EN DOS COLUMNAS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1fr) 2fr', gap: '20px', maxWidth: '1100px', margin: '0 auto' }}>
                
                {/* COLUMNA IZQUIERDA: PERFIL INTERACTIVO Y LISTA DE ESPERA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* TARJETA DE IDENTIDAD DEL PACIENTE */}
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '25px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#0056b3', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>
                                {patient?.nombreCompleto?.charAt(0) || 'P'}
                            </div>
                            {!isEditing && (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    style={{ backgroundColor: '#f1f3f5', color: '#0056b3', border: '1px solid #ced4da', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                                >
                                    ✏️ Editar Datos
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleGuardarPerfil} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div>
                                    <small style={{ color: '#aaa', fontWeight: 'bold', display: 'block', fontSize: '10px' }}>NOMBRE COMPLETO (BLOQUEADO)</small>
                                    <input type="text" value={patient?.nombreCompleto || 'Pedro Pascal Balmaceda'} readOnly style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #dee2e6', backgroundColor: '#e9ecef', color: '#495057', boxSizing: 'border-box', cursor: 'not-allowed' }} />
                                </div>
                                <div>
                                    <small style={{ color: '#aaa', fontWeight: 'bold', display: 'block', fontSize: '10px' }}>RUT (BLOQUEADO)</small>
                                    <input type="text" value={patient?.rut || '12345678-9'} readOnly style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #dee2e6', backgroundColor: '#e9ecef', color: '#495057', boxSizing: 'border-box', cursor: 'not-allowed' }} />
                                </div>
                                <div>
                                    <small style={{ color: '#0056b3', fontWeight: 'bold', display: 'block', fontSize: '10px' }}>CORREO ELECTRÓNICO</small>
                                    <input type="email" name="correo" value={localEditableData.correo} onChange={handleInputChange} required style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #0056b3', boxSizing: 'border-box' }} />
                                </div>
                                <div>
                                    <small style={{ color: '#0056b3', fontWeight: 'bold', display: 'block', fontSize: '10px' }}>TELÉFONO CONTACTO</small>
                                    <input type="text" name="telefono" value={localEditableData.telefono} onChange={handleInputChange} required style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #0056b3', boxSizing: 'border-box' }} />
                                </div>
                                <div>
                                    <small style={{ color: '#0056b3', fontWeight: 'bold', display: 'block', fontSize: '10px' }}>DIRECCIÓN</small>
                                    <input type="text" name="direccion" value={localEditableData.direccion} onChange={handleInputChange} required style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #0056b3', boxSizing: 'border-box' }} />
                                </div>
                                <div style={{ backgroundColor: '#fff9db', padding: '10px', borderRadius: '6px', marginTop: '5px' }}>
                                    <small style={{ color: '#b78103', fontWeight: 'bold', display: 'block', fontSize: '10px', marginBottom: '4px' }}>🚨 EN CASO DE EMERGENCIA</small>
                                    <input type="text" name="contactoEmergenciaNombre" placeholder="Nombre Contacto" value={localEditableData.contactoEmergenciaNombre} onChange={handleInputChange} required style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ced4da', marginBottom: '6px', boxSizing: 'border-box' }} />
                                    <input type="text" name="contactoEmergenciaTelefono" placeholder="Teléfono" value={localEditableData.contactoEmergenciaTelefono} onChange={handleInputChange} required style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ced4da', boxSizing: 'border-box' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                                    <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', flex: 1 }}>Guardar</button>
                                    <button type="button" onClick={() => setIsEditing(false)} style={{ backgroundColor: '#747d8c', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', flex: 1 }}>Cancelar</button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <h3 style={{ color: '#333', margin: '0 0 5px 0' }}>{patient?.nombreCompleto || 'Pedro Pascal Balmaceda'}</h3>
                                <span style={{ color: '#777', fontSize: '13px', display: 'block', marginBottom: '15px' }}>RUT: {patient?.rut || '12345678-9'}</span>
                                
                                <div style={{ borderTop: '1px solid #eee', paddingTop: '12px', marginBottom: '12px' }}>
                                    <small style={{ color: '#888', fontWeight: 'bold', display: 'block', fontSize: '10px', marginBottom: '3px' }}>CONTACTO DIRECTO</small>
                                    <span style={{ color: '#555', fontSize: '13px', display: 'block' }}>📧 {localEditableData.correo || 'pedro.pascal@rednorte.cl'}</span>
                                    <span style={{ color: '#555', fontSize: '13px', display: 'block', marginTop: '3px' }}>📞 {localEditableData.telefono}</span>
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <small style={{ color: '#888', fontWeight: 'bold', display: 'block', fontSize: '10px', marginBottom: '3px' }}>DIRECCIÓN RESIDENCIAL</small>
                                    <span style={{ color: '#555', fontSize: '13px' }}>🏠 {localEditableData.direccion}</span>
                                </div>

                                <div style={{ borderTop: '1px solid #eee', paddingTop: '12px', backgroundColor: '#fff9db', padding: '10px', borderRadius: '6px' }}>
                                    <small style={{ color: '#b78103', fontWeight: 'bold', display: 'block', fontSize: '10px', marginBottom: '3px' }}>📞 EN CASO DE EMERGENCIA</small>
                                    <span style={{ color: '#333', fontSize: '13px', fontWeight: 'bold', display: 'block' }}>{localEditableData.contactoEmergenciaNombre}</span>
                                    <span style={{ color: '#555', fontSize: '13px' }}>{localEditableData.contactoEmergenciaTelefono}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* SECCIÓN PRIORIDAD SANITARIA */}
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

                {/* COLUMNA DERECHA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* BOTONERA ACCIONES RÁPIDAS */}
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px 30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <button onClick={handleAgendarHora} style={{ backgroundColor: '#0056b3', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', flex: '1', minWidth: '150px' }}>
                            ➕ Agendar Nueva Hora
                        </button>
                        <button 
                            onClick={() => handleAnularHora(101)} 
                            style={{ 
                                backgroundColor: citaAnulada ? '#f8f9fa' : '#dc3545', 
                                color: citaAnulada ? '#adb5bd' : 'white', 
                                border: citaAnulada ? '1px solid #dee2e6' : 'none', 
                                padding: '10px 20px', 
                                borderRadius: '6px', 
                                cursor: citaAnulada ? 'not-allowed' : 'pointer', 
                                fontWeight: 'bold', 
                                fontSize: '14px', 
                                flex: '1', 
                                minWidth: '150px',
                                transition: '0.2s'
                            }}
                            disabled={citaAnulada}
                        >
                            ❌ Anular Hora
                        </button>
                    </div>
                    
                    {/* SECCIÓN PESTAÑAS MÉDICAS */}
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
                                    <div style={{ 
                                        backgroundColor: citaAnulada ? '#fcfcfc' : '#f8f9fa', 
                                        borderRadius: '6px', 
                                        padding: '20px', 
                                        borderLeft: citaAnulada ? '4px solid #dc3545' : '4px solid #28a745', 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center', 
                                        opacity: citaAnulada ? 0.6 : 1,
                                        border: '1px solid #eee'
                                    }}>
                                        <div>
                                            <h4 style={{ margin: '0 0 5px 0', color: citaAnulada ? '#777' : '#333', textDecoration: citaAnulada ? 'line-through' : 'none' }}>Cardiología - Control</h4>
                                            <p style={{ margin: '3px 0', color: '#666', fontSize: '13px' }}>👨‍⚕️ Dr. Alejandro Sanz</p>
                                            <p style={{ margin: '3px 0', color: '#888', fontSize: '13px' }}>📅 20-05-2026, 10:00 a. m. | 📍 Box A-12</p>
                                        </div>
                                        <div style={{ backgroundColor: citaAnulada ? '#f8d7da' : '#e8f5e9', padding: '10px 15px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '25px', height: '25px' }}>
                                            {citaAnulada ? <span style={{ color: '#dc3545', fontSize: '20px', fontWeight: 'bold' }}>✖</span> : <span style={{ color: '#28a745', fontSize: '20px', fontWeight: 'bold' }}>✔</span>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'historial' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Atenciones Anteriores</h3>
                                    <div style={{ backgroundColor: '#fcfcfc', borderRadius: '6px', padding: '15px', borderLeft: '4px solid #28a745', border: '1px solid #eee' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <h4 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '14px' }}>Medicina General - Evaluación</h4>
                                                <p style={{ margin: '0', color: '#888', fontSize: '12px' }}>📅 05-02-2026 | Dra. Camila Rojas</p>
                                            </div>
                                            <span style={{ backgroundColor: '#e8f5e9', color: '#28a745', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>✔ Asistió</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* DOCUMENTOS */}
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>📄 Recetas y Exámenes Disponibles</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', border: '1px solid #eee', borderRadius: '6px' }}>
                                <div>
                                    <span style={{ fontWeight: 'bold', display: 'block', fontSize: '13px', color: '#333' }}>Receta Médica Electrónica - Tratamiento Crónico</span>
                                    <small style={{ color: '#aaa' }}>Emitido por Cardiología el 01-06-2026</small>
                                </div>
                                <button onClick={() => handleDescargarPDF('Receta.pdf')} style={{ color: '#0056b3', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#e8f0fe', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                                    Descargar PDF
                                </button>
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