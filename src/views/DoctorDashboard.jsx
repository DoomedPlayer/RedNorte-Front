import React, { useState } from 'react';
import PatientCrudModal from '../components/PatientCrudModal';

export default function DoctorDashboard({ onNavigate }) {
    // Estado local para simular la base de datos
    const [pacientes, setPacientes] = useState([
        { id: 1, rut: '12345678-9', nombre: 'Pedro Pascal Balmaceda', edad: 48, prevision: 'Fonasa B', estado: 'En Tratamiento' },
        { id: 2, rut: '9876543-2', nombre: 'Mon Laferte', edad: 40, prevision: 'Isapre', estado: 'Alta Médica' },
        { id: 3, rut: '11223344-5', nombre: 'Alexis Sánchez', edad: 35, prevision: 'Fonasa C', estado: 'Pendiente Exámenes' },
        { id: 4, rut: '19283746-K', nombre: 'Francisca Valenzuela', edad: 41, prevision: 'Fonasa A', estado: 'En Tratamiento' }
    ]);

    // Estados para controlar el Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

    const handleAbrirCrear = () => {
        setPacienteSeleccionado(null); // Formulario vacío
        setIsModalOpen(true);
    };

    const handleAbrirEditar = (paciente) => {
        setPacienteSeleccionado(paciente); // Cargar datos del paciente
        setIsModalOpen(true);
    };

    const handleGuardarPaciente = (data) => {
        if (pacienteSeleccionado) {
            // ACTUALIZAR (Edit)
            setPacientes(pacientes.map(p => p.id === data.id ? data : p));
            alert("Ficha clínica actualizada con éxito.");
        } else {
            // CREAR (Add)
            // Validar que el RUT no esté repetido de forma local
            if (pacientes.some(p => p.rut === data.rut)) {
                alert("Error: Ya existe un paciente registrado con ese RUT.");
                return;
            }
            setPacientes([...pacientes, data]);
            alert("Nuevo paciente registrado exitosamente en RedNorte.");
        }
        setIsModalOpen(false);
    };

    const handleEliminarPaciente = (id, nombre) => {
        const confirmar = window.confirm(`¿Estás seguro de que deseas ELIMINAR permanentemente la ficha clínica de ${nombre}?`);
        if (confirmar) {
            setPacientes(pacientes.filter(p => p.id !== id));
            alert("Registro eliminado correctamente.");
        }
    };

    return (
        <div className="doctor-dashboard" style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '10px 20px 40px 20px' }}>
            
            <PatientCrudModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleGuardarPaciente} 
                pacienteAEditar={pacienteSeleccionado}
            />

            {/* BANNER PRINCIPAL */}
            <div style={{ backgroundColor: '#1b1e23', color: 'white', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '8px', maxWidth: '1200px', margin: '20px auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ backgroundColor: '#0056b3', color: 'white', padding: '10px 15px', borderRadius: '4px', fontWeight: 'bold' }}>
                        🏥 REDNORTE
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '22px' }}>Portal Clínico - Equipo Médico</h1>
                        <span style={{ fontSize: '13px', color: '#aaa' }}>Dr. Alejandro Sanz | Especialidad: Cardiología</span>
                    </div>
                </div>
                <button 
                    onClick={() => onNavigate('loginDoctor')} 
                    style={{ backgroundColor: 'transparent', color: '#ff6b6b', border: '1px solid #ff6b6b', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Cerrar Sesión
                </button>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* PANEL ESTADÍSTICAS */}
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #0056b3' }}>
                        <p style={{ margin: '0 0 5px 0', color: '#888', fontSize: '13px', fontWeight: 'bold' }}>TOTAL PACIENTES ACARGO</p>
                        <h2 style={{ margin: 0, color: '#333', fontSize: '28px' }}>{pacientes.length}</h2>
                    </div>
                    <div style={{ flex: '1', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #2ed573' }}>
                        <p style={{ margin: '0 0 5px 0', color: '#888', fontSize: '13px', fontWeight: 'bold' }}>CITAS HOY</p>
                        <h2 style={{ margin: 0, color: '#333', fontSize: '28px' }}>5</h2>
                    </div>
                    <div style={{ flex: '1', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #ffa502' }}>
                        <p style={{ margin: '0 0 5px 0', color: '#888', fontSize: '13px', fontWeight: 'bold' }}>PENDIENTES DE REVISIÓN</p>
                        <h2 style={{ margin: 0, color: '#333', fontSize: '28px' }}>2</h2>
                    </div>
                </div>

                {/* TABLA CRUD */}
                <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #f4f6f9', paddingBottom: '15px' }}>
                        <h3 style={{ margin: 0, color: '#333', fontSize: '20px' }}>📋 Gestión de Pacientes</h3>
                        <button 
                            onClick={handleAbrirCrear}
                            style={{ backgroundColor: '#2ed573', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
                        >
                            ➕ Ingresar Nuevo Paciente
                        </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa', color: '#555', fontSize: '14px' }}>
                                    <th style={{ padding: '12px 15px', borderBottom: '2px solid #eee' }}>RUT</th>
                                    <th style={{ padding: '12px 15px', borderBottom: '2px solid #eee' }}>Nombre Completo</th>
                                    <th style={{ padding: '12px 15px', borderBottom: '2px solid #eee' }}>Edad</th>
                                    <th style={{ padding: '12px 15px', borderBottom: '2px solid #eee' }}>Previsión</th>
                                    <th style={{ padding: '12px 15px', borderBottom: '2px solid #eee' }}>Estado Clínico</th>
                                    <th style={{ padding: '12px 15px', borderBottom: '2px solid #eee', textAlign: 'center' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pacientes.map((paciente) => (
                                    <tr key={paciente.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '15px', fontSize: '14px', color: '#666' }}>{paciente.rut}</td>
                                        <td style={{ padding: '15px', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>{paciente.nombre}</td>
                                        <td style={{ padding: '15px', fontSize: '14px', color: '#666' }}>{paciente.edad} años</td>
                                        <td style={{ padding: '15px', fontSize: '14px', color: '#666' }}>{paciente.prevision}</td>
                                        <td style={{ padding: '15px', fontSize: '14px' }}>
                                            <span style={{ 
                                                backgroundColor: paciente.estado === 'Alta Médica' ? '#e8f5e9' : paciente.estado === 'En Tratamiento' ? '#e3f2fd' : '#fff3cd', 
                                                color: paciente.estado === 'Alta Médica' ? '#2e7d32' : paciente.estado === 'En Tratamiento' ? '#1565c0' : '#856404', 
                                                padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' 
                                            }}>
                                                {paciente.estado}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                            <button onClick={() => handleAbrirEditar(paciente)} style={{ backgroundColor: '#f8f9fa', border: '1px solid #d1d9e6', color: '#0056b3', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                                                ✏️ Editar
                                            </button>
                                            <button onClick={() => handleEliminarPaciente(paciente.id, paciente.nombre)} style={{ backgroundColor: '#ffebee', border: '1px solid #ffcdd2', color: '#c62828', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                                                🗑️ Borrar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}