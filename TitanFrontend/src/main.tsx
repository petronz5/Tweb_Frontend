import React from 'react';
import ReactDOM from 'react-dom/client'; // Usa createRoot da react-dom/client
import App from './App';
import './index.css'; // Importa eventuali stili globali

// Ottieni il nodo radice
const rootElement = document.getElementById('root');

// Verifica che rootElement non sia null e crea il root
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.error("Elemento root non trovato");
}
