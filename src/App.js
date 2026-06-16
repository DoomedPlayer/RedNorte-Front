import React, { useState } from 'react';
import LoginUsuario from './views/LoginUsuario';
import RegistroUsuario from './views/RegistroUsuario';
import DashboardView from './views/DashboardView'; 
import DoctorDashboard from './views/DoctorDashboard';
import LoginDoctor from './views/LoginDoctor';

function App() {
  // Estado inicial restaurado: La app arranca en el login principal de pacientes
  const [currentView, setCurrentView] = useState('login');

  const navigateTo = (view) => {
    setCurrentView(view);
  };

  return (
    <>
      {currentView === 'login' && (
        <LoginUsuario onNavigate={navigateTo} />
      )}
      
      {currentView === 'registro' && (
        <RegistroUsuario onNavigate={navigateTo} />
      )}
      
      {currentView === 'dashboard' && (
        <DashboardView onNavigate={navigateTo} />
      )}

      {currentView === 'doctor' && (
        <DoctorDashboard onNavigate={navigateTo} />
      )}

      {currentView === 'loginDoctor' && (
        <LoginDoctor onNavigate={navigateTo} />
      )}
    </>
  );
}

export default App;