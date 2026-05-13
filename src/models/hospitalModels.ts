export interface Paciente {
  rut: string;
  nombreCompleto: string;
  fechaNacimiento: string;
  emailContacto: string;
  telefono: string;
}

export interface Cita {
  id: number;
  rutPaciente: string; 
  fechaHora: string; 
  especialidad: string;
  estado: string; 
  boxAtencion: string;
}