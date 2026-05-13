import React from 'react';
import { Cita } from '../models/hospitalModels';

export const CitaCard: React.FC<{ cita: Cita }> = ({ cita }) => (
  <div className="cita-card">
    <div className="cita-details">
      <p><strong>{cita.especialidad}</strong></p>
      <p>📅 {new Date(cita.fechaHora).toLocaleString('es-CL')}</p>
      <p>📍 {cita.boxAtencion}</p>
    </div>
    <div className={`cita-status ${cita.estado === 'PROGRAMADA' ? 'status-programada' : 'status-atendida'}`}>
      {cita.estado}
    </div>
  </div>
);

