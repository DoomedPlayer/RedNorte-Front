import React, { useState } from 'react';
import LoginUsuario from './views/LoginUsuario';
import RegistroUsuario from './views/RegistroUsuario';
import DashboardView from './views/DashboardView'; 
import DoctorDashboard from './views/DoctorDashboard';
import LoginDoctor from './views/LoginDoctor'; // <-- IMPORTAMOS EL LOGIN DEL DOCTOR

function App() {
  // Lo dejamos en loginDoctor para que lo pruebes de inmediato
  const [currentView, setCurrentView] = useState('loginDoctor');

  // Función de navegación sin anotaciones de tipo
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

      {/* NUEVA RUTA: LOGIN DEL DOCTOR */}
      {currentView === 'loginDoctor' && (
        <LoginDoctor onNavigate={navigateTo} />
      )}
    </>
  );
}

export default App;