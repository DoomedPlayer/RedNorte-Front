import { useState } from 'react';

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

    // --- ACCIÓN DE LOGIN (Navegación instantánea y silenciosa para presentación) ---
    const loginSubmit = async (e, onNavigate) => {
        e.preventDefault();
        
        if (!loginData.rut || !loginData.password) {
            return;
        }

        // Usuario test requerido
        const usuarioTest = {
            rut: "12345678-9",
            password: "password123"
        };

        // Redirección inmediata sin avisos molestos de localhost
        if (loginData.rut === usuarioTest.rut && loginData.password === usuarioTest.password) {
            if (onNavigate) {
                onNavigate('dashboard');
            }
        } else {
            console.warn("Credenciales incorrectas ingresadas.");
        }
    };

    const registerSubmit = async (e) => {
        e.preventDefault();
        console.log("Datos enviados al registro:", registerData);
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