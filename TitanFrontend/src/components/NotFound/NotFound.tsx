import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound: React.FC = () => {
    return (
        <div className="not-found-container">
            <h1>404 - Pagina Non Trovata</h1>
            <p>La pagina che stai cercando non esiste.</p>
            <Link to="/" className="home-link">Torna alla Home</Link>
        </div>
    );
};

export default NotFound;
