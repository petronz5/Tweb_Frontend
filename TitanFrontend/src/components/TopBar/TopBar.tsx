import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserDropdown from '../UserDropdown/UserDropdown.tsx'; // Ensure the path is correct
import './TopBar.css';

const Topbar: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = sessionStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleLogout = () => {
        // Remove user information from the session
        sessionStorage.removeItem('username');
        setUsername(null);
        // Redirect to the login page or home
        navigate('/login');
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
                    <li><Link to="/cart">Carrello</Link></li>
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
