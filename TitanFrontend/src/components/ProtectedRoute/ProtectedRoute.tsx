// ProtectedRoute.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './ProtectedRoute.css'; // Assicurati di creare questo file o usare quello esistente

interface ProtectedRouteProps {
    element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const isAuthenticated = !!sessionStorage.getItem('username');

    return isAuthenticated ? (
        element
    ) : (
        <div className="protected-container">
            <h2>Non puoi vedere questa sezione se non sei loggato.</h2>
            <Link to="/login" className="login-link">Vai al Login</Link>
        </div>
    );
};

export default ProtectedRoute;
