import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TopBar.css';

const Topbar: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const storedUsername = sessionStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    return (
        <nav className="topbar">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/products">Articoli</Link></li>
                <li><Link to="/cart">Carrello</Link></li> {/* Aggiungi il link al carrello */}
                <li>
                    {username ? (
                        <span>Benvenuto, {username}</span>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default Topbar;
