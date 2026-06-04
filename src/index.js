import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './views/DashboardView.jsx'; // <-- Cambiamos la ruta para que apunte a tu nueva vista
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
