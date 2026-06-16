import React, { useState } from 'react';

export const AgendarModal = ({ isOpen, onClose, onConfirm }) => {
    // Estados para guardar lo que elija el paciente en el formulario
    const [especialidad, setEspecialidad] = useState("1");
    const [tipoAtencion, setTipoAtencion] = useState("CONSULTA");

    // Si el modal no está abierto, no renderizamos nada
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Le enviamos a la vista principal los datos listos para el backend
        onConfirm({
            idEspecialidad: parseInt(especialidad),
            tipoAtencion: tipoAtencion
        });
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(2px)' }}>
            
            {/* Contenedor principal del Modal */}
            <div style={{ backgroundColor: 'white', borderRadius: '10px', width: '90%', maxWidth: '450px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', overflow: 'hidden', animation: 'fadeIn 0.3s ease' }}>
                
                {/* Cabecera Azul Institucional */}
                <div style={{ backgroundColor: '#0056b3', color: 'white', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ➕ Agendar Nueva Hora
                    </h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer', opacity: 0.8 }}>✖</button>
                </div>

                {/* Cuerpo del Formulario */}
                <div style={{ padding: '25px' }}>
                    <form onSubmit={handleSubmit}>
                        
                        {/* Selector de Especialidad */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>Especialidad Requerida:</label>
                            <select value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', backgroundColor: '#f8f9fa' }}>
                                <option value="1">Cardiología</option>
                                <option value="2">Traumatología</option>
                                <option value="3">Pediatría</option>
                                <option value="4">Medicina General</option>
                            </select>
                        </div>

                        {/* Selector de Tipo de Atención */}
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>Tipo de Atención:</label>
                            <select value={tipoAtencion} onChange={(e) => setTipoAtencion(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', backgroundColor: '#f8f9fa' }}>
                                <option value="CONSULTA">Consulta Médica General</option>
                                <option value="PROCEDIMIENTO">Procedimiento de Rutina</option>
                                <option value="CIRUGIA">Cirugía Menor</option>
                                <option value="URGENCIA">Atención de Urgencia</option>
                            </select>
                        </div>

                        {/* Botonera inferior */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button type="button" onClick={onClose} style={{ backgroundColor: '#f4f6f9', color: '#333', border: '1px solid #d1d9e6', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                                Cancelar
                            </button>
                            <button type="submit" style={{ backgroundColor: '#0056b3', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                                Confirmar Reserva
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};