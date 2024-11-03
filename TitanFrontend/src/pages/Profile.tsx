import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import {
    faUser,
    faEnvelope,
    faCalendarAlt,
    faSignOutAlt,
    faBirthdayCake,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface UserDetails {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    creationDate: string;
    birthDate: string;
}

const Profile: React.FC = () => {
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/TitanCommerce/profile', {
            method: 'GET',
            credentials: 'include',
        })
            .then(response => {
                if (response.status === 401) {
                    // Se il server risponde con 401, significa che la sessione è scaduta o l'utente non è loggato
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
            <h1>Il Tuo Profilo</h1>
            <div className="profile-details">
                <div className="profile-item">
                    <FontAwesomeIcon icon={faUser} className="icon" />
                    <p><strong>Username:</strong> {userDetails.username}</p>
                </div>
                <div className="profile-item">
                    <FontAwesomeIcon icon={faEnvelope} className="icon" />
                    <p><strong>Email:</strong> {userDetails.email}</p>
                </div>
                <div className="profile-item">
                    <FontAwesomeIcon icon={faUser} className="icon" />
                    <p><strong>Nome:</strong> {userDetails.firstName}</p>
                </div>
                <div className="profile-item">
                    <FontAwesomeIcon icon={faUser} className="icon" />
                    <p><strong>Cognome:</strong> {userDetails.lastName}</p>
                </div>
                <div className="profile-item">
                    <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
                    <p><strong>Data Creazione Account:</strong> {formattedCreationDate}</p>
                </div>
                <div className="profile-item">
                    <FontAwesomeIcon icon={faBirthdayCake} className="icon" />
                    <p><strong>Data di Nascita:</strong> {formattedBirthDate}</p>
                </div>
            </div>
            <button className="logout-button" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="icon-button" />
                Logout
            </button>
        </div>
    );
};

export default Profile;
