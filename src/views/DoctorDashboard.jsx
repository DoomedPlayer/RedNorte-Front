import React, { useState } from 'react';
import PatientCrudModal from '../components/PatientCrudModal';
import Swal from 'sweetalert2';

// Arreglo de bloques horarios de 30 minutos para la jornada laboral
const HORARIOS_DISPONIBLES = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", 
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", 
    "17:00", "17:30", "18:00"
];

export default function DoctorDashboard({ onNavigate }) {
    // 1. ESTADOS PARA PACIENTES (CRUD)
    const [pacientes, setPacientes] = useState([
        { id: 1, rut: '12345678-9', nombre: 'Pedro Pascal Balmaceda', edad: 48, prevision: 'Fonasa B', estado: 'En Tratamiento' },
        { id: 2, rut: '9876543-2', nombre: 'Mon Laferte', edad: 40, prevision: 'Isapre', estado: 'Alta Médica' },
        { id: 3, rut: '11223344-5', nombre: 'Alexis Sánchez', edad: 35, prevision: 'Fonasa C', estado: 'Pendiente Exámenes' },
        { id: 4, rut: '19283746-K', nombre: 'Francisca Valenzuela', edad: 41, prevision: 'Fonasa A', estado: 'En Tratamiento' }
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

    // 2. ESTADOS PARA HORAS MÉDICAS Y LISTA DE ESPERA
    const [citas, setCitas] = useState([
        { id: 101, rut: '12345678-9', paciente: 'Pedro Pascal Balmaceda', fecha: '2026-06-20', hora: '10:00', estado: 'Programada' },
        { id: 102, rut: '9876543-2', paciente: 'Mon Laferte', fecha: '2026-06-21', hora: '11:30', estado: 'Programada' },
        { id: 103, rut: '11223344-5', paciente: 'Alexis Sánchez', fecha: '2026-06-22', hora: '09:00', estado: 'Reasignada' },
        { id: 104, rut: '21886383-3', paciente: 'Donnovan Urrutia', fecha: 'Por asignar', hora: 'Por asignar', estado: 'En Espera' },
        { id: 105, rut: '19283746-K', paciente: 'Francisca Valenzuela', fecha: 'Por asignar', hora: 'Por asignar', estado: 'Cancelada' }
    ]);

    // 3. ESTADO DEL MENÚ (TABS)
    const [activeTab, setActiveTab] = useState('horas'); 

    // ==========================================
    // LÓGICA DE PACIENTES (CRUD)
    // ==========================================
    const handleAbrirCrear = () => { setPacienteSeleccionado(null); setIsModalOpen(true); };
    const handleAbrirEditar = (paciente) => { setPacienteSeleccionado(paciente); setIsModalOpen(true); };

    const handleGuardarPaciente = (data) => {
        if (pacienteSeleccionado) {
            setPacientes(pacientes.map(p => p.id === data.id ? data : p));
            Swal.fire({ title: '¡Actualizado!', text: 'Ficha clínica actualizada.', icon: 'success', confirmButtonColor: '#0056b3' });
        } else {
            if (pacientes.some(p => p.rut === data.rut)) {
                Swal.fire({ title: 'Error', text: 'Ya existe este RUT.', icon: 'error', confirmButtonColor: '#0056b3' });
                return;
            }
            setPacientes([...pacientes, data]);
            Swal.fire({ title: '¡Registrado!', text: 'Paciente registrado.', icon: 'success', confirmButtonColor: '#2ed573' });
        }
        setIsModalOpen(false);
    };

    const handleEliminarPaciente = (id, nombre) => {
        Swal.fire({
            title: '¿Estás seguro?', text: `Vas a ELIMINAR a ${nombre}.`, icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#c62828', cancelButtonColor: '#888', confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                setPacientes(pacientes.filter(p => p.id !== id));
                Swal.fire({ title: '¡Eliminado!', text: 'Registro borrado.', icon: 'success', confirmButtonColor: '#0056b3' });
            }
        });
    };

    // ==========================================
    // LÓGICA DE HORAS MÉDICAS Y LISTA DE ESPERA
    // ==========================================
    const handleAgendarNuevaHora = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Ingresar Cita Directa',
            html:
                '<input id="swal-rut" class="swal2-input" placeholder="RUT del Paciente" style="width: 70%;">' +
                '<input id="swal-paciente" class="swal2-input" placeholder="Nombre Completo" style="width: 70%;">' +
                '<div style="margin-top: 15px;"><label style="font-weight: bold; font-size: 14px;">Seleccionar Fecha:</label><br><input id="swal-fecha" type="date" class="swal2-input" style="width: 70%;"></div>' +
                '<div style="margin-top: 15px;"><label style="font-weight: bold; font-size: 14px;">Seleccionar Hora:</label><br><select id="swal-hora" class="swal2-input" style="width: 70%;"><option value="">-- Seleccione Fecha Primero --</option></select></div>',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Guardar Cita',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#0056b3',
            // LÓGICA INTELIGENTE DE HORARIOS
            didOpen: () => {
                const dateInput = document.getElementById('swal-fecha');
                const timeSelect = document.getElementById('swal-hora');

                dateInput.addEventListener('change', () => {
                    const selectedDate = dateInput.value;
                    // Buscamos qué horas ya están tomadas en esa fecha
                    const bookedTimes = citas
                        .filter(c => c.fecha === selectedDate && c.estado !== 'Cancelada' && c.estado !== 'En Espera')
                        .map(c => c.hora);

                    timeSelect.innerHTML = '<option value="">-- Seleccione Hora --</option>';
                    
                    HORARIOS_DISPONIBLES.forEach(t => {
                        const opt = document.createElement('option');
                        opt.value = t;
                        if (bookedTimes.includes(t)) {
                            opt.text = `${t} (Ocupado)`;
                            opt.disabled = true; // Bloqueamos la hora
                            opt.style.color = '#dc3545';
                        } else {
                            opt.text = t;
                        }
                        timeSelect.appendChild(opt);
                    });
                });
            },
            preConfirm: () => {
                return [
                    document.getElementById('swal-rut').value,
                    document.getElementById('swal-paciente').value,
                    document.getElementById('swal-fecha').value,
                    document.getElementById('swal-hora').value
                ]
            }
        });

        if (formValues) {
            const [rut, paciente, fecha, hora] = formValues;
            if(!rut || !paciente || !fecha || !hora) {
                Swal.fire('Campos incompletos', 'Por favor llena todos los datos y selecciona una hora.', 'error');
                return;
            }
            setCitas([...citas, { id: Date.now(), rut, paciente, fecha, hora, estado: 'Programada' }]);
            Swal.fire('¡Agendada!', 'La hora médica ha sido registrada exitosamente.', 'success');
        }
    };

    const handleGestionarCita = async (cita) => {
        const isEspera = cita.estado === 'En Espera';
        const necesitaLimpiar = isEspera || cita.estado === 'Cancelada' || cita.fecha === 'Por asignar';
        
        const title = isEspera ? 'Asignar Hora desde Lista' : 'Reasignar Hora Médica';
        const confirmBtnText = isEspera ? 'Confirmar Asignación' : 'Guardar Cambios';
        const btnColor = isEspera ? '#2ed573' : '#ffa502';

        const { value: formValues } = await Swal.fire({
            title: title,
            text: `Paciente: ${cita.paciente}`,
            html:
                `<div style="margin-top: 15px;"><label style="font-weight: bold; font-size: 14px;">Seleccionar Fecha:</label><br><input id="swal-fecha-reasignar" type="date" class="swal2-input" value="${necesitaLimpiar ? '' : cita.fecha}" style="width: 70%;"></div>` +
                `<div style="margin-top: 15px;"><label style="font-weight: bold; font-size: 14px;">Seleccionar Hora:</label><br><select id="swal-hora-reasignar" class="swal2-input" style="width: 70%;"><option value="">-- Seleccione Fecha Primero --</option></select></div>`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: confirmBtnText,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: btnColor,
            // LÓGICA INTELIGENTE DE HORARIOS (CON PRE-SELECCIÓN)
            didOpen: () => {
                const dateInput = document.getElementById('swal-fecha-reasignar');
                const timeSelect = document.getElementById('swal-hora-reasignar');

                const updateTimes = () => {
                    const selectedDate = dateInput.value;
                    // Evitamos contar la hora actual del paciente que estamos editando como "Ocupada"
                    const bookedTimes = citas
                        .filter(c => c.fecha === selectedDate && c.id !== cita.id && c.estado !== 'Cancelada' && c.estado !== 'En Espera')
                        .map(c => c.hora);

                    timeSelect.innerHTML = '<option value="">-- Seleccione Hora --</option>';
                    
                    HORARIOS_DISPONIBLES.forEach(t => {
                        const opt = document.createElement('option');
                        opt.value = t;
                        if (bookedTimes.includes(t)) {
                            opt.text = `${t} (Ocupado)`;
                            opt.disabled = true;
                            opt.style.color = '#dc3545';
                        } else {
                            opt.text = t;
                        }
                        // Pre-seleccionar la hora si coincide con la cita original
                        if (!necesitaLimpiar && selectedDate === cita.fecha && t === cita.hora) {
                            opt.selected = true;
                        }
                        timeSelect.appendChild(opt);
                    });
                };

                dateInput.addEventListener('change', updateTimes);
                // Si al abrir ya hay una fecha cargada, actualizamos las horas de inmediato
                if (dateInput.value) updateTimes(); 
            },
            preConfirm: () => {
                return [
                    document.getElementById('swal-fecha-reasignar').value,
                    document.getElementById('swal-hora-reasignar').value
                ]
            }
        });

        if (formValues) {
            const [fecha, hora] = formValues;
            if(!fecha || !hora) {
                Swal.fire('Error', 'Debes seleccionar una fecha y hora válidas', 'error');
                return;
            }
            setCitas(citas.map(c => c.id === cita.id ? { ...c, fecha, hora, estado: isEspera ? 'Programada' : 'Reasignada' } : c));
            Swal.fire(isEspera ? '¡Asignada!' : '¡Reasignada!', isEspera ? 'El paciente ha salido de la lista de espera.' : 'La nueva fecha y hora han sido guardadas.', 'success');
        }
    };

    const handleCancelarHora = (id, nombre) => {
        Swal.fire({
            title: '¿Cancelar esta cita?',
            text: `Se anulará el registro de ${nombre}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#888',
            confirmButtonText: 'Sí, cancelar cita'
        }).then((result) => {
            if (result.isConfirmed) {
                setCitas(citas.map(c => c.id === id ? { ...c, estado: 'Cancelada', fecha: 'Por asignar', hora: 'Por asignar' } : c));
                Swal.fire('¡Cancelada!', 'La hora médica ha sido anulada.', 'success');
            }
        });
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
                <button onClick={() => onNavigate('loginDoctor')} style={{ backgroundColor: 'transparent', color: '#ff6b6b', border: '1px solid #ff6b6b', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Cerrar Sesión
                </button>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* PANEL ESTADÍSTICAS DINÁMICO */}
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #0056b3' }}>
                        <p style={{ margin: '0 0 5px 0', color: '#888', fontSize: '13px', fontWeight: 'bold' }}>TOTAL PACIENTES ACARGO</p>
                        <h2 style={{ margin: 0, color: '#333', fontSize: '28px' }}>{pacientes.length}</h2>
                    </div>
                    <div style={{ flex: '1', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #2ed573' }}>
                        <p style={{ margin: '0 0 5px 0', color: '#888', fontSize: '13px', fontWeight: 'bold' }}>CITAS ACTIVAS</p>
                        <h2 style={{ margin: 0, color: '#333', fontSize: '28px' }}>{citas.filter(c => c.estado === 'Programada' || c.estado === 'Reasignada').length}</h2>
                    </div>
                    <div style={{ flex: '1', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #9b59b6' }}>
                        <p style={{ margin: '0 0 5px 0', color: '#888', fontSize: '13px', fontWeight: 'bold' }}>EN LISTA DE ESPERA</p>
                        <h2 style={{ margin: 0, color: '#333', fontSize: '28px' }}>{citas.filter(c => c.estado === 'En Espera').length}</h2>
                    </div>
                </div>

                {/* CONTENEDOR PRINCIPAL CON TABS */}
                <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    
                    {/* MENÚ DE PESTAÑAS */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #eee', backgroundColor: '#f8f9fa' }}>
                        <button 
                            onClick={() => setActiveTab('pacientes')}
                            style={{ flex: '1', padding: '18px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', color: activeTab === 'pacientes' ? '#0056b3' : '#777', borderBottom: activeTab === 'pacientes' ? '3px solid #0056b3' : '3px solid transparent', transition: 'all 0.2s' }}
                        >
                            👥 Gestión de Pacientes
                        </button>
                        <button 
                            onClick={() => setActiveTab('horas')}
                            style={{ flex: '1', padding: '18px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', color: activeTab === 'horas' ? '#0056b3' : '#777', borderBottom: activeTab === 'horas' ? '3px solid #0056b3' : '3px solid transparent', transition: 'all 0.2s' }}
                        >
                            📅 Agenda y Lista de Espera
                        </button>
                    </div>

                    <div style={{ padding: '30px' }}>
                        
                        {/* VISTA 1: GESTIÓN DE PACIENTES */}
                        {activeTab === 'pacientes' && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h3 style={{ margin: 0, color: '#333', fontSize: '20px' }}>Fichas Clínicas Activas</h3>
                                    <button onClick={handleAbrirCrear} style={{ backgroundColor: '#2ed573', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
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
                                                        <span style={{ backgroundColor: paciente.estado === 'Alta Médica' ? '#e8f5e9' : paciente.estado === 'En Tratamiento' ? '#e3f2fd' : '#fff3cd', color: paciente.estado === 'Alta Médica' ? '#2e7d32' : paciente.estado === 'En Tratamiento' ? '#1565c0' : '#856404', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                                                            {paciente.estado}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '15px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                        <button onClick={() => handleAbrirEditar(paciente)} style={{ backgroundColor: '#f8f9fa', border: '1px solid #d1d9e6', color: '#0056b3', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>✏️ Editar</button>
                                                        <button onClick={() => handleEliminarPaciente(paciente.id, paciente.nombre)} style={{ backgroundColor: '#ffebee', border: '1px solid #ffcdd2', color: '#c62828', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>🗑️ Borrar</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* VISTA 2: GESTIÓN DE HORAS Y LISTA ESPERA */}
                        {activeTab === 'horas' && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h3 style={{ margin: 0, color: '#333', fontSize: '20px' }}>Agenda y Lista de Espera</h3>
                                    <button onClick={handleAgendarNuevaHora} style={{ backgroundColor: '#0056b3', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                                        ➕ Cita Directa
                                    </button>
                                </div>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#f8f9fa', color: '#555', fontSize: '14px' }}>
                                                <th style={{ padding: '12px 15px', borderBottom: '2px solid #eee' }}>RUT</th>
                                                <th style={{ padding: '12px 15px', borderBottom: '2px solid #eee' }}>Paciente</th>
                                                <th style={{ padding: '12px 15px', borderBottom: '2px solid #eee' }}>Fecha Asignada</th>
                                                <th style={{ padding: '12px 15px', borderBottom: '2px solid #eee' }}>Hora</th>
                                                <th style={{ padding: '12px 15px', borderBottom: '2px solid #eee' }}>Estado de Cita</th>
                                                <th style={{ padding: '12px 15px', borderBottom: '2px solid #eee', textAlign: 'center' }}>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {citas.map((cita) => (
                                                <tr key={cita.id} style={{ borderBottom: '1px solid #eee', opacity: cita.estado === 'Cancelada' ? 0.6 : 1, backgroundColor: cita.estado === 'En Espera' ? '#fafafa' : 'transparent' }}>
                                                    <td style={{ padding: '15px', fontSize: '14px', color: '#666' }}>{cita.rut}</td>
                                                    <td style={{ padding: '15px', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>{cita.paciente}</td>
                                                    <td style={{ padding: '15px', fontSize: '14px', color: cita.estado === 'En Espera' || cita.estado === 'Cancelada' ? '#aaa' : '#666' }}>
                                                        {cita.fecha === 'Por asignar' ? '---' : `📅 ${cita.fecha}`}
                                                    </td>
                                                    <td style={{ padding: '15px', fontSize: '14px', color: cita.estado === 'En Espera' || cita.estado === 'Cancelada' ? '#aaa' : '#666', fontWeight: cita.estado === 'En Espera' || cita.estado === 'Cancelada' ? 'normal' : 'bold' }}>
                                                        {cita.hora === 'Por asignar' ? '---' : `⏰ ${cita.hora} hrs`}
                                                    </td>
                                                    <td style={{ padding: '15px', fontSize: '14px' }}>
                                                        <span style={{ 
                                                            backgroundColor: cita.estado === 'Programada' ? '#e3f2fd' : cita.estado === 'Reasignada' ? '#fff3cd' : cita.estado === 'En Espera' ? '#f3e5f5' : '#f8d7da', 
                                                            color: cita.estado === 'Programada' ? '#1565c0' : cita.estado === 'Reasignada' ? '#856404' : cita.estado === 'En Espera' ? '#8e44ad' : '#721c24', 
                                                            padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' 
                                                        }}>
                                                            {cita.estado === 'En Espera' ? '⏳ En Lista de Espera' : cita.estado}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '15px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                        
                                                        {/* BOTÓN REASIGNAR SIEMPRE ACTIVO */}
                                                        <button 
                                                            onClick={() => handleGestionarCita(cita)} 
                                                            style={{ 
                                                                backgroundColor: cita.estado === 'En Espera' ? '#e3f2fd' : '#fff3cd', 
                                                                border: cita.estado === 'En Espera' ? '1px solid #bbdefb' : '1px solid #ffeeba', 
                                                                color: cita.estado === 'En Espera' ? '#1565c0' : '#856404', 
                                                                padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' 
                                                            }}
                                                        >
                                                            {cita.estado === 'En Espera' ? '📅 Asignar' : '🔄 Reasignar'}
                                                        </button>

                                                        {/* BOTÓN CANCELAR */}
                                                        <button 
                                                            onClick={() => handleCancelarHora(cita.id, cita.paciente)} 
                                                            disabled={cita.estado === 'Cancelada'}
                                                            style={{ backgroundColor: cita.estado === 'Cancelada' ? '#eee' : '#ffebee', border: cita.estado === 'Cancelada' ? 'none' : '1px solid #ffcdd2', color: cita.estado === 'Cancelada' ? '#aaa' : '#c62828', padding: '6px 10px', borderRadius: '4px', cursor: cita.estado === 'Cancelada' ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                                                        >
                                                            ❌ Cancelar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {citas.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#888' }}>No hay registros en la agenda.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div style={{ textAlign: 'center', color: '#888', fontSize: '12px', marginTop: '40px' }}>© 2026 Red Norte Salud - Panel de Administración Médica</div>
        </div>
    );
}