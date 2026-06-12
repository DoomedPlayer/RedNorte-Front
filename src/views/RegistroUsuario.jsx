import React from 'react';
import { useAuthVM } from '../viewmodels/useAuthVM';

const RegistroUsuario = ({ onNavigate }) => {
    const { registerData, handleRegisterChange, registerSubmit } = useAuthVM();

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2>📝 Registro de Nuevo Paciente</h2>
                    <p>Por favor, ingrese sus datos personales básicos</p>
                </div>
                
                <form style={styles.form} onSubmit={registerSubmit}>
                    
                    {/* Sección 1: Identificación */}
                    <h3 style={styles.sectionTitle}>1. Identificación</h3>
                    <div style={styles.row}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>RUT *</label>
                            <input 
                                type="text" 
                                name="rut"
                                value={registerData.rut || ''}
                                onChange={handleRegisterChange}
                                placeholder="Ej: 12345678-9" 
                                style={styles.input} 
                                required 
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Correo Electrónico *</label>
                            <input 
                                type="email" 
                                name="correo"
                                value={registerData.correo || ''}
                                onChange={handleRegisterChange}
                                placeholder="ejemplo@correo.com" 
                                style={styles.input} 
                                required 
                            />
                        </div>
                    </div>

                    {/* Sección 2: Datos Personales */}
                    <h3 style={styles.sectionTitle}>2. Datos Personales</h3>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Nombres *</label>
                        <input 
                            type="text" 
                            name="nombre"
                            value={registerData.nombre || ''}
                            onChange={handleRegisterChange}
                            placeholder="Ej: Pedro Pascal" 
                            style={styles.input} 
                            required 
                        />
                    </div>

                    <div style={styles.row}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Apellido Paterno *</label>
                            <input 
                                type="text" 
                                name="apellidoPaterno"
                                value={registerData.apellidoPaterno || ''}
                                onChange={handleRegisterChange}
                                placeholder="Ej: Balmaceda" 
                                style={styles.input} 
                                required 
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Apellido Materno</label>
                            <input 
                                type="text" 
                                name="apellidoMaterno"
                                value={registerData.apellidoMaterno || ''}
                                onChange={handleRegisterChange}
                                placeholder="Ej: Beger" 
                                style={styles.input} 
                            />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Teléfono Celular *</label>
                        <input 
                            type="tel" 
                            name="telefono"
                            value={registerData.telefono || ''}
                            onChange={handleRegisterChange}
                            placeholder="Ej: +56 9 1234 5678" 
                            style={styles.input} 
                            required 
                        />
                    </div>

                    {/* Sección 3: Contacto de Emergencia */}
                    <h3 style={styles.sectionTitle}>🚨 3. En Caso de Emergencia Avisar A:</h3>
                    
                    <div style={styles.row}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Nombre Completo *</label>
                            <input 
                                type="text" 
                                name="contactoEmergenciaNombre"
                                value={registerData.contactoEmergenciaNombre || ''}
                                onChange={handleRegisterChange}
                                placeholder="Ej: María Carmen" 
                                style={styles.input} 
                                required 
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Parentesco / Vínculo *</label>
                            <input 
                                type="text" 
                                name="contactoEmergenciaParentesco"
                                value={registerData.contactoEmergenciaParentesco || ''}
                                onChange={handleRegisterChange}
                                placeholder="Ej: Esposa, Hijo, Madre" 
                                style={styles.input} 
                                required 
                            />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Teléfono de Emergencia *</label>
                        <input 
                            type="tel" 
                            name="contactoEmergenciaTelefono"
                            value={registerData.contactoEmergenciaTelefono || ''}
                            onChange={handleRegisterChange}
                            placeholder="Ej: +56 9 8765 4321" 
                            style={styles.input} 
                            required 
                        />
                    </div>

                    {/* Sección 4: Seguridad */}
                    <h3 style={styles.sectionTitle}>4. Seguridad</h3>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Contraseña para el Portal *</label>
                        <input 
                            type="password" 
                            name="password"
                            value={registerData.password || ''}
                            onChange={handleRegisterChange}
                            placeholder="Cree una contraseña segura" 
                            style={styles.input} 
                            required 
                        />
                    </div>

                    {/* Botones de acción */}
                    <div style={styles.buttonContainer}>
                        <button 
                            type="button" 
                            onClick={() => onNavigate('login')} 
                            style={styles.cancelButton}
                        >
                            Volver al Login
                        </button>
                        <button type="submit" style={styles.submitButton}>
                            Registrarme
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'Arial, sans-serif', padding: '20px' },
    card: { backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '100%', maxWidth: '650px' },
    header: { textAlign: 'center', marginBottom: '25px', color: '#0056b3' },
    sectionTitle: { fontSize: '16px', color: '#d9534f', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginTop: '15px', marginBottom: '10px', fontWeight: 'bold' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    row: { display: 'flex', gap: '15px', flexWrap: 'wrap' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px', flex: '1', minWidth: '240px' },
    label: { fontWeight: 'bold', fontSize: '14px', color: '#333' },
    input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' },
    buttonContainer: { display: 'flex', justifyContent: 'space-between', gap: '15px', marginTop: '25px' },
    submitButton: { padding: '12px 24px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold', flex: '1' },
    cancelButton: { padding: '12px 24px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold', flex: '1' }
};

export default RegistroUsuario;