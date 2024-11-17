// ProtectedRoute.tsx.
import React from 'react';

interface ProtectedRouteProps {
    element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const isAuthenticated = !!sessionStorage.getItem('username');

    return isAuthenticated ? (
        element
    ) : (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Non puoi vedere questo se non sei loggato.</h2>
        </div>
    );
};

export default ProtectedRoute;
