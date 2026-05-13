import React from 'react';
import { useHospitalViewModel } from '../viewmodels/useHospitalModels.ts'; 
import { PacienteInfo } from '../components/PacienteInfo.tsx';
import { CitaCard } from '../components/CitaCard.tsx';

const PortalHospital: React.FC = () => {
  const { pacientes, loading, getCitasByRut } = useHospitalViewModel();

  if (loading) return <div className="loading">Cargando registros de Red Norte...</div>;

  return (
    <main>
      {pacientes.map(p => (
        <article key={p.rut} className="paciente-card">
          <PacienteInfo paciente={p} />
          
          <div className="citas-section">
            <h3>Horas Médicas Programadas</h3>
            {getCitasByRut(p.rut).length > 0 ? (
              getCitasByRut(p.rut).map(c => <CitaCard key={c.id} cita={c} />)
            ) : (
              <p>No se registran horas pendientes.</p>
            )}
          </div>
        </article>
      ))}
    </main>
  );
};

export default PortalHospital;