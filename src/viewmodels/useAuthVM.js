import { useState } from 'react';
import api from '../api';

export const useAuthVM = () => {
    // --- ESTADOS PARA EL LOGIN ---
    const [loginData, setLoginData] = useState({
        rut: '',
        password: ''
    });

    // --- ESTADOS PARA EL REGISTRO ---
    const [registerData, setRegisterData] = useState({
        rut: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        correo: '',
        telefono: '',
        contactoEmergenciaNombre: '',
        contactoEmergenciaParentesco: '',
        contactoEmergenciaTelefono: '',
        password: ''
    });

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData(prevState => ({ ...prevState, [name]: value }));
    };

    const loginSubmit = async (e, onNavigate) => {
       e.preventDefault();
        
        if (!loginData.rut || !loginData.password) {
            alert("Por favor ingrese RUT y contraseña");
            return;
        }

        try {
            const response = await api.post('/api/auth/login', {
                rut: loginData.rut,
                password: loginData.password
            });

            localStorage.setItem('jwt_token', response.data.token);

            if (onNavigate) {
                onNavigate('dashboard');
            }
        } catch (error) {
            console.error("Error de autenticación:", error);
            alert("Credenciales incorrectas o servidor no disponible.");
        }
    };

    const registerSubmit = async (e, onNavigate) => {
        e.preventDefault();
        try {
            await api.post('/api/v1/auth/register', registerData);
            
            alert("¡Registro exitoso! Puede iniciar sesión con sus nuevas credenciales.");

            if (onNavigate) {
                onNavigate('login');
            }
        } catch (error) {
            console.error("Error al registrar:", error);
            alert("Hubo un problema con el registro. Quizás el RUT ya existe.");
        }
    };

    return {
        loginData,
        handleLoginChange,
        loginSubmit,
        registerData,
        handleRegisterChange,
        registerSubmit
    };
};