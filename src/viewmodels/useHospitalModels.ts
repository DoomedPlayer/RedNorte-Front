import { useState, useEffect } from 'react';
import { Paciente,Cita } from '../models/hospitalModels';

export const useHospitalViewModel = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        // En una implementación real, aquí llamarías a tus microservicios
        const mockPacientes: Paciente[] = [
          { 
            rut: "12345678-9", 
            nombreCompleto: "Juan Pérez", 
            fechaNacimiento: "1990-05-15", 
            emailContacto: "juan@correo.com", 
            telefono: "+56912345678" 
          }
        ];
        
        const mockCitas: Cita[] = [
          { 
            id: 1, 
            rutPaciente: "12345678-9", 
            fechaHora: "2026-05-20T10:00:00", 
            especialidad: "Cardiología", 
            estado: "PROGRAMADA", 
            boxAtencion: "Box A-12" 
          }
        ];

        setPacientes(mockPacientes);
        setCitas(mockCitas);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalData();
  }, []);

  const getCitasByRut = (rut: string) => {
    return citas.filter(cita => cita.rutPaciente === rut);
  };

  return { pacientes, loading, getCitasByRut };
};