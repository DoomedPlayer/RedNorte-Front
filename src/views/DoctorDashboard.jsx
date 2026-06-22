import React, { useState, useEffect} from 'react';
import api from '../api';
import PatientCrudModal from '../components/PatientCrudModal';
import Swal from 'sweetalert2';

const TURNOS = {
    "Mañana": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00"],
    "Tarde": ["13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"]
};

const BOXES = Array.from({ length: 20 }, (_, i) => `Box ${i + 1}`);

export default function DoctorDashboard({ onNavigate }) {

    const [pacientes, setPacientes] = useState([]);
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [doctorInfo, setDoctorInfo] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
    const [activeTab, setActiveTab] = useState('horas');

    // ==========================================
    // 1. CARGA INICIAL DE DATOS
    // ==========================================
    useEffect(() => {
        const fetchDatosMedicos = async () => {
            try {
                const rutLogueado = localStorage.getItem('rut');

                if (!rutLogueado || rutLogueado === 'undefined' || rutLogueado === 'null') {
                    Swal.fire('Sesión Expirada', 'Por favor, inicia sesión nuevamente.', 'warning');
                    onNavigate('loginDoctor');
                    return; 
                }
                
                const doctorResponse = await api.get(`/api/portal/medicos/${rutLogueado}`);
                const doctorActual = {
                    ...doctorResponse.data,
                    hospitales: [
                        { nombre: "Hospital A", turno: "Mañana" },
                        { nombre: "Clínica B", turno: "Tarde" }
                    ]
                };
                setDoctorInfo(doctorActual);

                const [pacientesResponse, citasResponse, esperaResponse] = await Promise.all([
                    api.get('/api/portal/pacientes'),
                    api.get(`/api/citas/especialidad/${doctorActual.especialidad}`), 
                    api.get(`/api/espera/lista/${doctorActual.idEspecialidad}`) 
                ]);

                const pacientesMapeados = pacientesResponse.data.map(p => ({
                    id: p.rut, rut: p.rut, nombre: p.nombreCompleto, edad: "N/A", prevision: "Fonasa", estado: p.estadoListaEspera
                }));

                const citasMapeadas = citasResponse.data.map(c => {
                    const pacienteEncontrado = pacientesMapeados.find(p => p.rut === c.rutPaciente);
                    let fechaSolo = "Por asignar", horaSolo = "Por asignar";
                    if (c.fechaHora) {
                        const partes = c.fechaHora.split('T');
                        fechaSolo = partes[0];
                        horaSolo = partes[1] ? partes[1].substring(0, 5) : "00:00";
                    }
                    return {
                        id: c.id, rut: c.rutPaciente, paciente: pacienteEncontrado ? pacienteEncontrado.nombre : 'Desconocido',
                        fecha: fechaSolo, hora: horaSolo, lugar: c.lugar, estado: c.estado || 'Programada', isWaitlist: false
                    };
                });

                const listaEsperaMapeada = esperaResponse.data.map(espera => {
                    const pacienteEncontrado = pacientesMapeados.find(p => p.rut === espera.rutPaciente);
                    return {
                        id: `espera-${espera.idLista}`, rut: espera.rutPaciente, paciente: pacienteEncontrado ? pacienteEncontrado.nombre : 'Desconocido',
                        fecha: 'Por asignar', hora: 'Por asignar', lugar: 'Por asignar', estado: 'En Espera', isWaitlist: true
                    };
                });

                setPacientes(pacientesMapeados);
                setCitas([...citasMapeadas, ...listaEsperaMapeada]);

            } catch (error) {
                console.error("Error cargando panel médico:", error);
                Swal.fire('Error', 'No se pudieron cargar los datos del servidor.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchDatosMedicos();
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px', marginTop: '100px', fontSize: '20px' }}>Cargando Panel Clínico... ⏳</div>;
    }

    // ==========================================
    // 2. LÓGICA DE PACIENTES (CRUD)
    // ==========================================
   const handleAbrirCrear = () => { setPacienteSeleccionado(null); setIsModalOpen(true); };
    const handleAbrirEditar = (paciente) => { setPacienteSeleccionado(paciente); setIsModalOpen(true); };

    const handleGuardarPaciente = async (data) => {
        try {
            if (pacienteSeleccionado) {
                const payloadEdicion = { nombre: data.nombre };
                await api.put(`/api/portal/pacientes/${data.rut}`, payloadEdicion);
                setPacientes(pacientes.map(p => p.id === data.id ? data : p));
                Swal.fire({ title: '¡Actualizado!', text: 'Ficha clínica actualizada en la base de datos.', icon: 'success', confirmButtonColor: '#0056b3' });
            } else {
                const partesNombre = data.nombre ? data.nombre.split(' ') : ['Paciente', 'Desconocido'];
                const payloadRegistro = {
                    rut: data.rut,
                    nombre: partesNombre[0],
                    apellidoPaterno: partesNombre[1] || '',
                    apellidoMaterno: partesNombre[2] || '',
                    correo: `${data.rut}@rednorte.cl`,
                    telefono: "000000000",
                    password: data.rut.substring(0, 4) 
                };
                await api.post('/api/auth/register', payloadRegistro);
                setPacientes([...pacientes, { ...data, id: data.rut, estado: 'En Tratamiento' }]);
                Swal.fire({ title: '¡Registrado!', text: `Paciente ingresado al sistema. Su clave temporal de acceso es: ${payloadRegistro.password}`, icon: 'success', confirmButtonColor: '#2ed573' });
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error al guardar paciente:", error);
            if (error.response && error.response.status === 400) {
                Swal.fire('Error', 'Este RUT ya se encuentra registrado en el sistema.', 'error');
            } else {
                Swal.fire('Error', 'No se pudo guardar la información en el servidor.', 'error');
            }
        }
    };

    const handleEliminarPaciente = (id, nombre) => {
        Swal.fire({
            title: '¿Sacar de la lista?', 
            text: `Vas a retirar a ${nombre} de los registros activos/espera.`, 
            icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#c62828', cancelButtonColor: '#888', confirmButtonText: 'Sí, retirar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Ahora usa la ruta correcta de la nueva arquitectura
                    await api.delete(`/api/espera/lista/${id}`);
                    setPacientes(pacientes.filter(p => p.id !== id));
                    setCitas(citas.filter(c => c.rut !== id));
                    Swal.fire({ title: '¡Retirado!', text: 'El paciente fue sacado de la lista exitosamente.', icon: 'success', confirmButtonColor: '#0056b3' });
                } catch (error) {
                    console.error("Error al retirar paciente:", error);
                    Swal.fire('Error', 'No se pudo retirar al paciente de la lista.', 'error');
                }
            }
        });
    };

    const renderFormularioCita = (isReasignacion = false, citaPrevia = null) => {
        return `
            ${!isReasignacion ? `
                <input id="swal-rut" class="swal2-input" placeholder="RUT del Paciente" style="width: 80%;">
                <input id="swal-paciente" class="swal2-input" placeholder="Nombre Completo" style="width: 80%;">
            ` : ''}
            
            <div style="margin-top: 15px; text-align: left; width: 80%; margin-left: auto; margin-right: auto;">
                <label style="font-weight: bold; font-size: 14px;">1. Seleccionar Recinto:</label>
                <select id="swal-hospital" class="swal2-input" style="width: 100%; margin-top: 5px;">
                    <option value="">-- Seleccione Hospital --</option>
                </select>
            </div>

            <div style="margin-top: 15px; text-align: left; width: 80%; margin-left: auto; margin-right: auto;">
                <label style="font-weight: bold; font-size: 14px;">2. Seleccionar Box:</label>
                <select id="swal-box" class="swal2-input" style="width: 100%; margin-top: 5px;">
                    <option value="">-- Seleccione Box --</option>
                </select>
            </div>

            <div style="margin-top: 15px; text-align: left; width: 80%; margin-left: auto; margin-right: auto;">
                <label style="font-weight: bold; font-size: 14px;">3. Seleccionar Fecha:</label>
                <input id="swal-fecha" type="date" class="swal2-input" style="width: 100%; margin-top: 5px;" value="${citaPrevia && citaPrevia.fecha !== 'Por asignar' ? citaPrevia.fecha : ''}">
            </div>

            <div style="margin-top: 15px; text-align: left; width: 80%; margin-left: auto; margin-right: auto;">
                <label style="font-weight: bold; font-size: 14px;">4. Seleccionar Hora (Depende del Hospital):</label>
                <select id="swal-hora" class="swal2-input" style="width: 100%; margin-top: 5px;">
                    <option value="">-- Seleccione Hospital y Fecha Primero --</option>
                </select>
            </div>
        `;
    };

    const setupSwalEventHandlers = (citaID = null) => {
        const hospitalSelect = document.getElementById('swal-hospital');
        const boxSelect = document.getElementById('swal-box');
        const dateInput = document.getElementById('swal-fecha');
        const timeSelect = document.getElementById('swal-hora');

        // Llenar Hospitales
        doctorInfo.hospitales.forEach(h => {
            const opt = document.createElement('option');
            opt.value = h.nombre;
            opt.text = `${h.nombre} (Turno ${h.turno})`;
            opt.dataset.turno = h.turno;
            hospitalSelect.appendChild(opt);
        });

        // Llenar Boxes
        BOXES.forEach(b => {
            const opt = document.createElement('option');
            opt.value = b;
            opt.text = b;
            boxSelect.appendChild(opt);
        });

        // Función que actualiza las horas basándose en el Hospital seleccionado
        const updateTimes = () => {
            const selectedDate = dateInput.value;
            const selectedHospIndex = hospitalSelect.selectedIndex;
            
            if (!selectedDate || selectedHospIndex === 0) {
                timeSelect.innerHTML = '<option value="">-- Seleccione Hospital y Fecha Primero --</option>';
                return;
            }

            const turno = hospitalSelect.options[selectedHospIndex].dataset.turno;
            const horariosDisponibles = TURNOS[turno] || [];
            
            // Verificamos qué horas ya están tomadas en esa fecha
            const bookedTimes = citas
                .filter(c => c.fecha === selectedDate && c.id !== citaID && c.estado !== 'Cancelada' && c.estado !== 'En Espera')
                .map(c => c.hora);

            timeSelect.innerHTML = '<option value="">-- Seleccione Hora --</option>';
            horariosDisponibles.forEach(t => {
                const opt = document.createElement('option');
                opt.value = t;
                if (bookedTimes.includes(t)) {
                    opt.text = `${t} (Ocupado)`; opt.disabled = true; opt.style.color = '#dc3545';
                } else {
                    opt.text = t;
                }
                timeSelect.appendChild(opt);
            });
        };

        hospitalSelect.addEventListener('change', updateTimes);
        dateInput.addEventListener('change', updateTimes);
    };

    const handleAgendarNuevaHora = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Ingresar Cita Directa',
            html: renderFormularioCita(false),
            focusConfirm: false, showCancelButton: true, confirmButtonText: 'Guardar Cita', confirmButtonColor: '#0056b3',
            didOpen: () => setupSwalEventHandlers(),
            preConfirm: () => {
                return {
                    rut: document.getElementById('swal-rut').value,
                    paciente: document.getElementById('swal-paciente').value,
                    hospital: document.getElementById('swal-hospital').value,
                    box: document.getElementById('swal-box').value,
                    fecha: document.getElementById('swal-fecha').value,
                    hora: document.getElementById('swal-hora').value
                }
            }
        });

        if (formValues) {
            const { rut, paciente, hospital, box, fecha, hora } = formValues;
            if(!rut || !paciente || !hospital || !box || !fecha || !hora) {
                return Swal.fire('Campos incompletos', 'Llene todos los datos solicitados.', 'error');
            }

            const payloadCita = {
                rutPaciente: rut,
                especialidad: doctorInfo.especialidad,      
                tipoAtencion: "CONTROL",
                medico: doctorInfo.nombre,
                fechaHora: `${fecha}T${hora}:00`, 
                lugar: `${hospital} - ${box}`, 
                estado: "Programada"
            };

            try {
                const response = await api.post('/api/citas', payloadCita);
                setCitas([...citas, { id: response.data.id, rut, paciente, fecha, hora, lugar: payloadCita.lugar, estado: 'Programada', isWaitlist: false }]);
                Swal.fire('¡Agendada!', 'La hora médica ha sido registrada.', 'success');
            } catch (error) {
                Swal.fire('Error', 'No se pudo agendar la cita.', 'error');
            }
        }
    };

    const handleGestionarCita = async (cita) => {
        const isEspera = cita.isWaitlist; 
        
        const { value: formValues } = await Swal.fire({
            title: isEspera ? 'Asignar Hora desde Lista' : 'Reasignar Hora Médica',
            text: `Paciente: ${cita.paciente}`,
            html: renderFormularioCita(true, cita),
            focusConfirm: false, showCancelButton: true, confirmButtonText: isEspera ? 'Confirmar Asignación' : 'Guardar Cambios', confirmButtonColor: isEspera ? '#2ed573' : '#ffa502',
            didOpen: () => setupSwalEventHandlers(cita.id),
            preConfirm: () => {
                return {
                    hospital: document.getElementById('swal-hospital').value,
                    box: document.getElementById('swal-box').value,
                    fecha: document.getElementById('swal-fecha').value,
                    hora: document.getElementById('swal-hora').value
                }
            }
        });

        if (formValues) {
            const { hospital, box, fecha, hora } = formValues;
            if(!hospital || !box || !fecha || !hora) return Swal.fire('Error', 'Debes completar toda la información del recinto y hora.', 'error');
            
            const lugarCompuesto = `${hospital} - ${box}`;

            try {
                if (isEspera) {
                    const payloadNuevaCita = {
                        rutPaciente: cita.rut, especialidad: doctorInfo.especialidad, tipoAtencion: "CONTROL",
                        medico: doctorInfo.nombre, fechaHora: `${fecha}T${hora}:00`, lugar: lugarCompuesto, estado: "Programada"
                    };
                    const responseCita = await api.post('/api/citas', payloadNuevaCita);
                    await api.delete(`/api/espera/lista/${cita.rut}`);
                    
                    setCitas(citas.map(c => c.id === cita.id ? { ...c, id: responseCita.data.id, fecha, hora, lugar: lugarCompuesto, estado: 'Programada', isWaitlist: false } : c));
                } else {
                    const payloadReasignacion = {
                        rutPaciente: cita.rut, especialidad: doctorInfo.especialidad, tipoAtencion: "CONTROL",
                        medico: doctorInfo.nombre, fechaHora: `${fecha}T${hora}:00`, lugar: lugarCompuesto, estado: 'Reasignada'
                    };
                    await api.put(`/api/citas/${cita.id}`, payloadReasignacion);
                    setCitas(citas.map(c => c.id === cita.id ? { ...c, fecha, hora, lugar: lugarCompuesto, estado: 'Reasignada' } : c));
                }
                Swal.fire(isEspera ? '¡Asignada!' : '¡Reasignada!', 'La fecha, hora y hospital han sido actualizados.', 'success');
            } catch (error) {
                Swal.fire('Error', 'No se pudo completar la operación.', 'error');
            }
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
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.post(`/api/citas/${id}/cancelar`);
                    setCitas(citas.map(c => c.id === id ? { ...c, estado: 'Cancelada', fecha: 'Por asignar', hora: 'Por asignar' } : c));
                    Swal.fire('¡Cancelada!', 'La hora médica ha sido anulada.', 'success');
                } catch (error) {
                    console.error("Error al cancelar:", error);
                    Swal.fire('Error', 'No se pudo anular la cita en el servidor.', 'error');
                }
            }
        });
    };

    // EL RETURN SE MANTIENE INTACTO YA QUE LA UI FUNCIONA PERFECTAMENTE
    return (
        <div className="doctor-dashboard" style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '10px 20px 40px 20px' }}>
            
            <PatientCrudModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleGuardarPaciente} pacienteAEditar={pacienteSeleccionado} />

            <div style={{ backgroundColor: '#1b1e23', color: 'white', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '8px', maxWidth: '1200px', margin: '20px auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ backgroundColor: '#0056b3', color: 'white', padding: '10px 15px', borderRadius: '4px', fontWeight: 'bold' }}>🏥 REDNORTE</div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '22px' }}>Portal Clínico - Equipo Médico</h1>
                        <span style={{ fontSize: '13px', color: '#aaa' }}>
                            {doctorInfo ? `${doctorInfo.nombre} | Especialidad: ${doctorInfo.especialidad}` : 'Cargando perfil...'}
                        </span>
                    </div>
                </div>
                <button onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('rut');
                    onNavigate('loginDoctor');
                    }} style={{ backgroundColor: 'transparent', color: '#ff6b6b', border: '1px solid #ff6b6b', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Cerrar Sesión</button>
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

                        {activeTab === 'horas' && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h3 style={{ margin: 0, color: '#333', fontSize: '20px' }}>Agenda y Lista de Espera</h3>
                                    <button onClick={handleAgendarNuevaHora} style={{ backgroundColor: '#0056b3', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>➕ Cita Directa</button>
                                </div>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#f8f9fa', color: '#555', fontSize: '14px' }}>
                                                <th style={{ padding: '12px 15px', borderBottom: '2px solid #eee' }}>RUT</th>
                                                <th style={{ padding: '12px 15px', borderBottom: '2px solid #eee' }}>Paciente</th>
                                                <th style={{ padding: '12px 15px', borderBottom: '2px solid #eee' }}>Fecha / Hora</th>
                                                <th style={{ padding: '12px 15px', borderBottom: '2px solid #eee' }}>Lugar de Atención</th>
                                                <th style={{ padding: '12px 15px', borderBottom: '2px solid #eee' }}>Estado</th>
                                                <th style={{ padding: '12px 15px', borderBottom: '2px solid #eee', textAlign: 'center' }}>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {citas.map((cita) => (
                                                <tr key={cita.id} style={{ borderBottom: '1px solid #eee', opacity: cita.estado === 'Cancelada' ? 0.6 : 1, backgroundColor: cita.estado === 'En Espera' ? '#fafafa' : 'transparent' }}>
                                                    <td style={{ padding: '15px', fontSize: '14px', color: '#666' }}>{cita.rut}</td>
                                                    <td style={{ padding: '15px', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>{cita.paciente}</td>
                                                    <td style={{ padding: '15px', fontSize: '14px', color: cita.estado === 'En Espera' || cita.estado === 'Cancelada' ? '#aaa' : '#666' }}>
                                                        {cita.fecha === 'Por asignar' ? '---' : <div>📅 {cita.fecha}<br/><span style={{fontWeight: 'bold'}}>⏰ {cita.hora} hrs</span></div>}
                                                    </td>
                                                    <td style={{ padding: '15px', fontSize: '14px', color: '#0056b3', fontWeight: 'bold' }}>
                                                        {cita.lugar === 'Por asignar' ? '---' : `🏥 ${cita.lugar}`}
                                                    </td>
                                                    <td style={{ padding: '15px', fontSize: '14px' }}>
                                                        <span style={{ backgroundColor: cita.estado === 'Programada' ? '#e3f2fd' : cita.estado === 'Reasignada' ? '#fff3cd' : cita.estado === 'En Espera' ? '#f3e5f5' : '#f8d7da', color: cita.estado === 'Programada' ? '#1565c0' : cita.estado === 'Reasignada' ? '#856404' : cita.estado === 'En Espera' ? '#8e44ad' : '#721c24', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                                                            {cita.estado === 'En Espera' ? '⏳ En Lista de Espera' : cita.estado}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '15px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                        <button onClick={() => handleGestionarCita(cita)} style={{ backgroundColor: cita.estado === 'En Espera' ? '#e3f2fd' : '#fff3cd', border: cita.estado === 'En Espera' ? '1px solid #bbdefb' : '1px solid #ffeeba', color: cita.estado === 'En Espera' ? '#1565c0' : '#856404', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                                                            {cita.estado === 'En Espera' ? '📅 Asignar' : '🔄 Reasignar'}
                                                        </button>
                                                        <button onClick={() => handleCancelarHora(cita.id, cita.paciente)} disabled={cita.estado === 'Cancelada' || cita.estado === 'En Espera'} style={{ backgroundColor: cita.estado === 'Cancelada' || cita.estado === 'En Espera' ? '#eee' : '#ffebee', border: cita.estado === 'Cancelada' || cita.estado === 'En Espera' ? 'none' : '1px solid #ffcdd2', color: cita.estado === 'Cancelada' || cita.estado === 'En Espera' ? '#aaa' : '#c62828', padding: '6px 10px', borderRadius: '4px', cursor: cita.estado === 'Cancelada' || cita.estado === 'En Espera' ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                                                            ❌ Cancelar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}