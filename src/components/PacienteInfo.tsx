import React from 'react';
import { Paciente } from '../models/hospitalModels';

export const PacienteInfo: React.FC<{ paciente: Paciente }> = ({ paciente }) => (
  <div className="paciente-header">
    <h2>{paciente.nombreCompleto}</h2>
    <div className="paciente-info-grid">
      <div className="info-item"><strong>RUT</strong> {paciente.rut}</div>
      <div className="info-item"><strong>Email</strong> {paciente.emailContacto}</div>
      <div className="info-item"><strong>Teléfono</strong> {paciente.telefono}</div>
    </div>
  </div>
);