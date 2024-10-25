import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Topbar from './components/Topbar/Topbar';
import Home from './pages/Home';
import PageProducts from './pages/PageProducts';
import Login from './pages/Login';
import CartPage from './pages/CartPage'; // Importa la nuova pagina del carrello
import { CartProvider } from './components/Cart/CartProvider'; // Importa il CartProvider

const App: React.FC = () => {
    return (
        <CartProvider>
            <Router>
                <Topbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<PageProducts />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/usercart" element={<CartPage />} /> {/* Aggiungi la route del carrello */}
                </Routes>
            </Router>
        </CartProvider>
    );
};

export default App;
