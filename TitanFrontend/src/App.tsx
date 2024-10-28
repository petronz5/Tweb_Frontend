import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Topbar from './components/Topbar/Topbar';
import Home from './pages/Home';
import PageProducts from './pages/PageProducts';
import Login from './pages/Login';
import CartPage from './pages/CartPage'; // Importa la nuova pagina del carrello
import { CartProvider } from './components/Cart/CartProvider'; // Importa il CartProvider
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Profile from "./pages/Profile.tsx"; // Importa ErrorBoundary dal nuovo percorso


const App: React.FC = () => {
    return (
        <CartProvider>
            <Router>
                <Topbar />
                {/* <ErrorBoundary> */}
                <Routes>
                    <Route path="/" element={<Profile />} />
                    <Route path="/products" element={<PageProducts />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/usercart" element={<CartPage />} />
                </Routes>
                {/* </ErrorBoundary> */}
            </Router>
        </CartProvider>
    );
};

export default App;
