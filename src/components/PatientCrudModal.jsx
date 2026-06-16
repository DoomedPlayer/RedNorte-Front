import React, { useState, useEffect } from 'react';

export default function PatientCrudModal({ isOpen, onClose, onSave, pacienteAEditar }) {
    const [rut, setRut] = useState('');
    const [nombre, setNombre] = useState('');
    const [edad, setEdad] = useState('');
    const [prevision, setPrevision] = useState('Fonasa B');
    const [estado, setEstado] = useState('En Tratamiento');

    // Si vamos a editar, cargamos los datos del paciente seleccionado
    useEffect(() => {
        if (pacienteAEditar) {
            setRut(pacienteAEditar.rut);
            setNombre(pacienteAEditar.nombre);
            setEdad(pacienteAEditar.edad);
            setPrevision(pacienteAEditar.prevision);
            setEstado(pacienteAEditar.estado);
        } else {
            // Si es nuevo, limpiamos el formulario
            setRut('');
            setNombre('');
            setEdad('');
            setPrevision('Fonasa B');
            setEstado('En Tratamiento');
        }
    }, [pacienteAEditar, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            id: pacienteAEditar ? pacienteAEditar.id : Date.now(),
            rut,
            nombre,
            edad: parseInt(edad),
            prevision,
            estado
        });
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '450px', fontFamily: 'sans-serif' }}>
                <h3 style={{ margin: '0 0 20px 0', color: '#1b1e23' }}>
                    {pacienteAEditar ? '✏️ Editar Ficha Paciente' : '➕ Registrar Nuevo Paciente'}
                </h3>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>RUT</label>
                        <input type="text" value={rut} onChange={(e) => setRut(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} required disabled={!!pacienteAEditar} />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Nombre Completo</label>
                        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} required />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Edad</label>
                            <input type="number" value={edad} onChange={(e) => setEdad(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Previsión</label>
                            <select value={prevision} onChange={(e) => setPrevision(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}>
                                <option value="Fonasa A">Fonasa A</option>
                                <option value="Fonasa B">Fonasa B</option>
                                <option value="Fonasa C">Fonasa C</option>
                                <option value="Isapre">Isapre</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Estado Clínico</label>
                        <select value={estado} onChange={(e) => setEstado(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}>
                            <option value="En Tratamiento">En Tratamiento</option>
                            <option value="Alta Médica">Alta Médica</option>
                            <option value="Pendiente Exámenes">Pendiente Exámenes</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} style={{ padding: '10px 15px', border: '1px solid #ccc', backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
                        <button type="submit" style={{ padding: '10px 20px', border: 'none', backgroundColor: '#0056b3', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    );
}