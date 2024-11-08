// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Topbar from './components/Topbar/Topbar';
import Home from './pages/Home';
import PageProducts from './pages/PageProducts';
import Login from './pages/Login';
import CartPage from './pages/CartPage';
import { CartProvider } from './components/Cart/CartProvider';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Profile from './pages/Profile';
import Footer from './components/Footer/Footer';
import CheckOut from './pages/CheckOut';
import PageOrders from "./pages/PageOrders.tsx";

const App: React.FC = () => {
    return (
        <CartProvider>
            <Router>
                <Topbar />
                <ErrorBoundary>
                    <div className="app-container">
                        <div className="content-wrap">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/products" element={<PageProducts />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/usercart" element={<CartPage />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/orders" element={<PageOrders />} />
                            </Routes>
                        </div>
                        <Footer />
                    </div>
                </ErrorBoundary>
            </Router>
        </CartProvider>
    );
};

export default App;
