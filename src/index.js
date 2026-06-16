import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // <--- Importamos el archivo App.js central
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
