import React, { useState } from 'react';
import api from '../api';

export default function LoginDoctor({ onNavigate }) {
const [rut, setRut] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); 

        if (!rut || !password) {
            setError('Por favor, complete ambos campos.');
            return;
        }

        try {
            const response = await api.post('/api/auth/login', {
                rut: rut,
                password: password
            });

            localStorage.setItem('jwt_token', response.data.token);
            localStorage.setItem('rut', response.data.rut);

            onNavigate('doctor'); 

        } catch (err) {
            console.error("Error en login médico:", err);
            setError('Credenciales incorrectas o acceso denegado.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'sans-serif' }}>
            <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
                
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ display: 'inline-block', backgroundColor: '#1b1e23', color: 'white', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', fontSize: '18px', letterSpacing: '1px', marginBottom: '10px' }}>
                        🏥 REDNORTE
                    </div>
                    <h2 style={{ margin: 0, color: '#333' }}>Acceso Médico</h2>
                    <p style={{ margin: '5px 0 0 0', color: '#888', fontSize: '14px' }}>Portal exclusivo para profesionales de la salud</p>
                </div>

                {error && (
                    <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '13px', textAlign: 'center', border: '1px solid #f5c6cb' }}>
                        {error}
                        <br/>
                        <small style={{ fontWeight: 'bold' }}>(Pista: 12345678-9 / *****)</small>
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontSize: '14px', fontWeight: 'bold' }}>RUT Médico</label>
                        <input 
                            type="text" 
                            placeholder="Ej: 12345678-9"
                            value={rut}
                            onChange={(e) => setRut(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' }}
                            required
                        />
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontSize: '14px', fontWeight: 'bold' }}>Contraseña</label>
                        <input 
                            type="password" 
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' }}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        style={{ backgroundColor: '#0056b3', color: 'white', padding: '14px', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', transition: '0.2s' }}
                    >
                        Ingresar al Sistema
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '25px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>¿No eres parte del equipo médico?</p>
                    <button 
                        onClick={() => onNavigate('login')}
                        style={{ background: 'none', border: 'none', color: '#0056b3', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px', fontSize: '14px', textDecoration: 'underline' }}
                    >
                        Ir al Portal de Pacientes
                    </button>
                </div>

            </div>
        </div>
    );
}