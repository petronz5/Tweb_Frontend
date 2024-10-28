import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css'; // Importa eventuali stili globali

// Montiamo l'applicazione React all'interno del div con id 'root'
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
