import React from 'react';
import logoRedNorte from './logo_rednorte.png';
import './RedNorte.css'
import PortalHospital from './views/PortalHospital.tsx';

function App() {
  return (
    <div className="app-container">
      <nav className="navbar">
        <img src={logoRedNorte} alt="Logo RedNorte" style={{ width: '130px', height: '90px' }} />
        <h1>RED NORTE</h1>
        <span>Portal del Paciente</span>
      </nav>
      <PortalHospital />
      <footer className="footer">
        © 2026 Red Norte Salud - Sistema de Gestión Médica
      </footer>
    </div>
  );
}

export default App;
