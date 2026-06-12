import React from 'react';
import { useAuthVM } from '../viewmodels/useAuthVM';

const LoginUsuario = ({ onNavigate }) => {
    // Consumimos los estados y manejadores del ViewModel
    const { loginData, handleLoginChange, loginSubmit } = useAuthVM();

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2>🏥 RED NORTE</h2>
                    <p>Portal del Paciente</p>
                </div>
                
                <form style={styles.form} onSubmit={loginSubmit}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>RUT del Paciente</label>
                        <input 
                            type="text" 
                            name="rut"
                            value={loginData.rut}
                            onChange={handleLoginChange}
                            placeholder="Ej: 12345678-9" 
                            style={styles.input}
                            required
                        />
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Contraseña</label>
                        <input 
                            type="password" 
                            name="password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            placeholder="********" 
                            style={styles.input}
                            required
                        />
                    </div>
                    
                    <button type="submit" style={styles.button}>
                        Ingresar
                    </button>

                    {/* Divisor visual y botón de registro para mayores de 40 */}
                    <div style={styles.registerContainer}>
                        <p style={styles.registerText}>¿Es su primera vez aquí?</p>
                        <button 
                            type="button" 
                            onClick={() => onNavigate('registro')}
                            style={styles.registerButton}
                        >
                            Crear Cuenta de Paciente Nuevo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f7f6',
        fontFamily: 'Arial, sans-serif'
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px',
        color: '#0056b3'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    },
    label: {
        fontWeight: 'bold',
        fontSize: '14px',
        color: '#333'
    },
    input: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '16px'
    },
    button: {
        padding: '12px',
        backgroundColor: '#0056b3',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '10px'
    },
    registerContainer: {
        marginTop: '15px',
        textAlign: 'center',
        borderTop: '1px solid #eee',
        paddingTop: '20px'
    },
    registerText: {
        fontSize: '14px',
        color: '#666',
        marginBottom: '10px'
    },
    registerButton: {
        backgroundColor: 'transparent',
        color: '#0056b3',
        border: '1px solid #0056b3',
        padding: '10px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        width: '100%',
        fontSize: '15px'
    }
};

export default LoginUsuario;