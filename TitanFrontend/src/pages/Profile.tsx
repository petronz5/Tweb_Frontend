import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

interface UserDetails {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    // Aggiungi altri campi se necessario
}

const ProfilePage: React.FC = () => {
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Controlla se l'utente è loggato
        const storedUsername = sessionStorage.getItem('username');
        if (storedUsername) {
            // Reindirizza al login se non loggato
            navigate('/login');
        } else {
            // Simula il recupero dei dettagli dell'utente (puoi sostituire con una chiamata API)
            const mockUserDetails: UserDetails = {
                username: storedUsername,
                email: 'utente@example.com',
                firstName: 'Nome',
                lastName: 'Cognome',
                // Aggiungi altri campi se necessario
            };
            setUserDetails(mockUserDetails);
        }
    }, [navigate]);

    const handleLogout = () => {
        // Rimuovi le informazioni dell'utente dalla sessione
        sessionStorage.removeItem('username');
        // Reindirizza alla pagina di login
        navigate('/login');
    };

    if (!userDetails) {
        return <div>Caricamento...</div>;
    }

    return (
        <div className="profile-page">
            <h1>Profilo</h1>
            <div className="profile-details">
                <p><strong>Username:</strong> {userDetails.username}</p>
                <p><strong>Email:</strong> {userDetails.email}</p>
                <p><strong>Nome:</strong> {userDetails.firstName}</p>
                <p><strong>Cognome:</strong> {userDetails.lastName}</p>
                {/* Aggiungi altri dettagli dell'utente se necessario */}
            </div>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default ProfilePage;
