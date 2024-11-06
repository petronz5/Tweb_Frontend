import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import {
    faUser,
    faEnvelope,
    faCalendarAlt,
    faSignOutAlt,
    faBirthdayCake,
    faVenusMars,
    faUserShield,
    faInfoCircle,
    faCogs,
    faPowerOff,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface UserDetails {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    creationDate: string;
    birthDate: string;
    role: string;
    sesso: string;
}

const Profile: React.FC = () => {
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [activeSection, setActiveSection] = useState('personal');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/TitanCommerce/profile', {
            method: 'GET',
            credentials: 'include',
        })
            .then(response => {
                if (response.status === 401) {
                    navigate('/login');
                    throw new Error('User not logged in');
                }
                if (!response.ok) {
                    throw new Error('Errore nel recupero dei dettagli utente');
                }
                return response.json();
            })
            .then(data => {
                setUserDetails(data);
            })
            .catch(error => {
                console.error('Errore nel recupero dei dettagli utente:', error);
                navigate('/login');
            });

        // Dati di esempio
        // const sampleData: UserDetails = {
        //     username: 'sampleuser',
        //     email: 'sampleuser@example.com',
        //     firstName: 'Mario',
        //     lastName: 'Rossi',
        //     creationDate: '2020-01-01',
        //     birthDate: '1990-05-15',
        //     role: 'Utente',
        //     gender: 'Maschio',
        //};
        //setUserDetails(sampleData);
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem('username');
        navigate('/');
    };

    if (!userDetails) {
        return <div>Caricamento...</div>;
    }

    const formattedCreationDate = new Date(userDetails.creationDate).toLocaleDateString('it-IT');
    const formattedBirthDate = new Date(userDetails.birthDate).toLocaleDateString('it-IT');

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-sidebar">
                    <div className="avatar-placeholder">
                        {/* Placeholder per l'immagine del profilo */}
                        <FontAwesomeIcon icon={faUser} className="avatar-icon" />
                    </div>
                    <div className="user-name">
                        {userDetails.firstName} {userDetails.lastName}
                    </div>
                    <nav className="profile-nav">
                        <ul>
                            <li
                                className={activeSection === 'personal' ? 'active' : ''}
                                onClick={() => setActiveSection('personal')}
                            >
                                <FontAwesomeIcon icon={faInfoCircle} className="nav-icon" />
                                Personal Info
                            </li>
                            <li
                                className={activeSection === 'account' ? 'active' : ''}
                                onClick={() => setActiveSection('account')}
                            >
                                <FontAwesomeIcon icon={faCogs} className="nav-icon" />
                                Account Info
                            </li>
                            <li
                                className={activeSection === 'logout' ? 'active' : ''}
                                onClick={() => setActiveSection('logout')}
                            >
                                <FontAwesomeIcon icon={faPowerOff} className="nav-icon" />
                                Logout
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="profile-content">
                    {activeSection === 'personal' && (
                        <div className="profile-section">
                            <h2>Personal Info</h2>
                            <div className="profile-item">
                                <FontAwesomeIcon icon={faUser} className="icon" />
                                <p><strong>Nome:</strong> {userDetails.firstName}</p>
                            </div>
                            <div className="profile-item">
                                <FontAwesomeIcon icon={faUser} className="icon" />
                                <p><strong>Cognome:</strong> {userDetails.lastName}</p>
                            </div>
                            <div className="profile-item">
                                <FontAwesomeIcon icon={faEnvelope} className="icon" />
                                <p><strong>Email:</strong> {userDetails.email}</p>
                            </div>
                            <div className="profile-item">
                                <FontAwesomeIcon icon={faUser} className="icon" />
                                <p><strong>Username:</strong> {userDetails.username}</p>
                            </div>
                            <div className="profile-item">
                                <FontAwesomeIcon icon={faBirthdayCake} className="icon" />
                                <p><strong>Data di Nascita:</strong> {formattedBirthDate}</p>
                            </div>
                            <div className="profile-item">
                                <FontAwesomeIcon icon={faVenusMars} className="icon" />
                                <p><strong>Sesso:</strong> {userDetails.sesso}</p>
                            </div>
                        </div>
                    )}

                    {activeSection === 'account' && (
                        <div className="profile-section">
                            <h2>Account Info</h2>
                            <div className="profile-item">
                                <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
                                <p><strong>Data Creazione Account:</strong> {formattedCreationDate}</p>
                            </div>
                            <div className="profile-item">
                                <FontAwesomeIcon icon={faUserShield} className="icon" />
                                <p><strong>Ruolo:</strong> {userDetails.role}</p>
                            </div>
                        </div>
                    )}

                    {activeSection === 'logout' && (
                        <div className="profile-section">
                            <h2>Logout</h2>
                            <p>Stai per uscire dal tuo account.</p>
                            <button className="logout-button" onClick={handleLogout}>
                                <FontAwesomeIcon icon={faSignOutAlt} className="icon-button" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
