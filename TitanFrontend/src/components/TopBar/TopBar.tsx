import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserDropdown from '../UserDropdown/UserDropdown';
import './TopBar.css';

const Topbar: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const updateUsername = () => {
            const storedUsername = sessionStorage.getItem('username');
            setUsername(storedUsername);
        };

        updateUsername();
        window.addEventListener('storage', updateUsername);

        return () => {
            window.removeEventListener('storage', updateUsername);
        };
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8080/TitanCommerce/logout', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                sessionStorage.removeItem('username');
                sessionStorage.removeItem('userId');
                setUsername(null);
                navigate('/login');
            } else {
                console.error('Errore durante il logout');
            }
        } catch (error) {
            console.error('Errore durante il logout:', error);
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Funzione per chiudere il menu quando si clicca su un link
    const handleLinkClick = () => {
        setMenuOpen(false);
    };

    return (
        <nav className="topbar">
            <div className="topbar-left">
                <div className="logo">
                    <Link to="/" className="logo-text">TitanCommerce</Link>
                </div>
            </div>

            <div className={`topbar-nav ${menuOpen ? 'open' : ''}`}>
                <ul>
                    <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
                    <li><Link to="/products" onClick={handleLinkClick}>Articoli</Link></li>
                    <li><Link to="/orders" onClick={handleLinkClick}>I miei ordini</Link></li>
                    <li><Link to="/usercart" onClick={handleLinkClick}>Carrello</Link></li>
                    <li className="hidden-link">
                        <Link to="/payment" className="hidden-link" onClick={handleLinkClick}>Pagamento</Link>
                    </li>
                    {!username && (
                        <li className="mobile-login-button">
                            <Link to="/login" className="login-button" onClick={handleLinkClick}>Login</Link>
                        </li>
                    )}
                </ul>
            </div>

            <div className="topbar-right">
                {username ? (
                    <UserDropdown username={username} onLogout={handleLogout} />
                ) : (
                    <Link to="/login" className="login-button">Login</Link>
                )}
            </div>

            <div className="hamburger" onClick={toggleMenu}>
                <div className={`bar ${menuOpen ? 'change' : ''}`}></div>
                <div className={`bar ${menuOpen ? 'change' : ''}`}></div>
                <div className={`bar ${menuOpen ? 'change' : ''}`}></div>
            </div>
        </nav>
    );
};

export default Topbar;
