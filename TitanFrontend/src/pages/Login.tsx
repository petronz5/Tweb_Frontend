import React, { useState } from 'react';
import './Login.css';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleLogin = async () => {
        const loginData = { username, password };

        try {
            const response = await fetch('http://localhost:8080/TitanCommerce/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const result = await response.json();

            if (result.success) {
                setSuccess(true);
                setError(null);
                sessionStorage.setItem('username', result.username);
                alert(`Benvenuto, ${result.username}!`);
            } else {
                setError(result.errorMessage);
            }
        } catch (err) {
            console.error('Errore durante il login:', err);
            setError('Errore di rete o server');
        }
    };

    return (
        <div className="login-page-wrapper"> {/* Wrapper per centrare il contenitore */}
            <div className="login-container">
                <h2>Accedi al tuo account</h2>
                <div className="input-group">
                    <label>Email:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Inserisci email"
                    />
                </div>
                <div className="input-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Inserisci password"
                    />
                </div>

                <div className="forgot-password">
                    <a href="#">Password dimenticata?</a>
                </div>

                <button onClick={handleLogin}>Accedi</button>

                {success && <p>Login effettuato con successo!</p>}
                {error && <p className="error-message">{error}</p>}

                <div className="social-login">
                    <p>Oppure accedi con</p>
                    <div className="social-login-options">
                        <button className="social-login-button google">
                            <img src="public/icons8-logo-di-google-48.png" alt="Google" className="social-icon" />
                            Accedi con Google
                        </button>
                        <button className="social-login-button microsoft">
                            <img src="public/icons8-microsoft-50.png" alt="Microsoft" className="social-icon" />
                            Accedi con Microsoft
                        </button>
                        <button className="social-login-button apple">
                            <img src="public/icons8-mac-os-50.png" alt="Apple" className="social-icon" />
                            Accedi con Apple
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
