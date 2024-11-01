import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

// Importa le icone di Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faCalendarAlt, faSignOutAlt, faBirthdayCake } from '@fortawesome/free-solid-svg-icons';

interface UserDetails {
    username: string | null;
    email: string;
    firstName: string;
    lastName: string;
    creationDate: string;
    birthDate: string;
    // Aggiungi altri campi se necessario
}

const ProfilePage: React.FC = () => {
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Controlla se l'utente è loggato
        const storedUsername = sessionStorage.getItem('username');
        //importante levare i commenti post test, così controlla se sono loggato
        // if (!storedUsername) {
        //     // Reindirizza al login se non loggato
        //     navigate('/login');
        // } else {
            // Simula il recupero dei dettagli dell'utente (puoi sostituire con una chiamata API)
            const mockUserDetails: UserDetails = {
                username: storedUsername,
                email: 'utente@example.com',
                firstName: 'Nome',
                lastName: 'Cognome',
                creationDate: '2020-01-01', // Data di creazione
                birthDate: '1990-05-15',     // Data di nascita
                // Aggiungi altri campi se necessario
            };
            setUserDetails(mockUserDetails);
        //}
    }, [navigate]);

    const handleLogout = () => {
        // Rimuovi le informazioni dell'utente dalla sessione
        sessionStorage.removeItem('username');
        // Reindirizza alla pagina di login
        navigate('/');
    };

    if (!userDetails) {
        return <div>Caricamento...</div>;
    }

    // Formatta le date
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
                {/* Aggiungi altri dettagli dell'utente se necessario */}
            </div>
            <button className="logout-button" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="icon-button" />
                Logout
            </button>
        </div>
    );
};

export default ProfilePage;
