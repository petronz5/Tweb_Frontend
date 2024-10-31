import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserDropdown from '../UserDropdown/UserDropdown'; // Rimuovi l'estensione .tsx se non necessaria
import './TopBar.css';

const Topbar: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Funzione per aggiornare lo stato dell'username
        const updateUsername = () => {
            const storedUsername = sessionStorage.getItem('username');
            setUsername(storedUsername);
        };

        // Imposta l'username al montaggio
        updateUsername();

        // Aggiungi un listener per gli eventi di storage
        window.addEventListener('storage', updateUsername);

        // Pulizia del listener al dismontaggio
        return () => {
            window.removeEventListener('storage', updateUsername);
        };
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8080/TitanCommerce/logout', {
                method: 'GET',
                credentials: 'include', // Invia cookie di sessione
            });

            if (response.ok) {
                // Rimuovi informazioni utente da sessionStorage
                sessionStorage.removeItem('username');
                sessionStorage.removeItem('userId');
                setUsername(null);
                // Redirigi alla pagina di login
                navigate('/login');
            } else {
                console.error('Errore durante il logout');
            }
        } catch (error) {
            console.error('Errore durante il logout:', error);
        }
    };

    return (
        <nav className="topbar">
            <div className="topbar-left">
                <div className="logo">
                    <Link to="/" className="logo-text">TitanCommerce</Link>
                </div>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/products">Articoli</Link></li>
                    <li><Link to="/products">Novità</Link></li>
                    <li><Link to="/products">Offerte</Link></li>
                    <li><Link to="/usercart">Carrello</Link></li>
                </ul>
            </div>
            <div className="topbar-right">
                {username ? (
                    <UserDropdown username={username} onLogout={handleLogout} />
                ) : (
                    <Link to="/login" className="login-button">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Topbar;
