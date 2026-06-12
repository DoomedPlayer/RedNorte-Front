import { useState } from 'react';

export const useAuthVM = () => {
    // --- ESTADOS PARA EL LOGIN ---
    const [loginData, setLoginData] = useState({
        rut: '',
        password: ''
    });

    // --- ESTADOS PARA EL REGISTRO DE NUEVO PACIENTE ---
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

    // --- MANEJADORES DE CAMBIOS (HANDLERS) ---
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // --- ACCIONES ---
    const loginSubmit = async (e) => {
        e.preventDefault();
        if (!loginData.rut || !loginData.password) {
            alert("Por favor, completa todos los campos del login.");
            return;
        }
        console.log("Intentando iniciar sesión con:", loginData.rut, loginData.password);
    };

    const registerSubmit = async (e) => {
        e.preventDefault();
        
        // Validación estricta y segura
        if (
            !registerData.rut || 
            !registerData.nombre || 
            !registerData.apellidoPaterno || 
            !registerData.correo || 
            !registerData.telefono ||
            !registerData.contactoEmergenciaNombre ||
            !registerData.contactoEmergenciaParentesco ||
            !registerData.contactoEmergenciaTelefono ||
            !registerData.password
        ) {
            alert("Por favor, completa todos los campos obligatorios (*).");
            return;
        }

        console.log("Enviando datos de registro esenciales a Spring Boot:", registerData);
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