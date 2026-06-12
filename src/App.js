import React, { useState } from 'react';
import LoginUsuario from './views/LoginUsuario';
import RegistroUsuario from './views/RegistroUsuario';
import DashboardView from './views/DashboardView'; 

function App() {
  // Estado limpio en JavaScript puro
  const [currentView, setCurrentView] = useState('login');

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
    </>
  );
}

export default App;