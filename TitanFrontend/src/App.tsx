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
import Footer from './components/Footer/Footer.tsx';
import CheckOut from "./pages/CheckOut.tsx";


const App: React.FC = () => {
    return (
        <CartProvider>
            <Router>
                <Topbar />
                <ErrorBoundary>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<PageProducts />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/usercart" element={<CartPage />} />
                        {/*<Route path="/checkout" element={<CheckOut />} />*/}
                    </Routes>
                        {/* Aggiungi il Footer qui */}
                        {/* </ErrorBoundary> */}
                </ErrorBoundary>
            </Router>
        </CartProvider>
    );
};

export default App;