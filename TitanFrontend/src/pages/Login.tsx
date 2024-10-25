import React, { useState } from 'react';
import './Login.css'
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
                sessionStorage.setItem('username', result.username); // Usa il valore dal backend
                alert(`Benvenuto, ${result.username}!`);
            } else {
                setError(result.errorMessage); // Mostra l'errore dal backend
            }
        } catch (err) {
            setError('Errore di rete o server');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <div>
                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <div className="forgot-password">
                <a href="#">Password dimenticata?</a>
            </div>

            <button onClick={handleLogin}>Login</button>
            {success && <p>Login effettuato con successo!</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Login;
