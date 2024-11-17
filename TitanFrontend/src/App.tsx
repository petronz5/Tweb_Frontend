// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import PageProducts from './pages/PageProducts';
import Login from './pages/Login';
import CartPage from './pages/CartPage';
import Profile from './pages/Profile';
import PageOrders from './pages/PageOrders';
import PaymentPage from './pages/PaymentPage';
import { CartProvider } from './components/Cart/CartProvider';
import Topbar from './components/TopBar/TopBar';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.tsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

const App: React.FC = () => {
    return (
        <Router>
            <CartProvider>
                <Topbar />
                <ErrorBoundary>
                    <div className="app-container">
                        <div className="content-wrap">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/products" element={<PageProducts />} />
                                <Route path="/login" element={<Login />} />

                                {/* Rotte protette */}
                                <Route path="/usercart" element={<ProtectedRoute element={<CartPage />} />} />
                                <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
                                <Route path="/payment" element={<ProtectedRoute element={<PaymentPage />} />} />
                                <Route path="/orders" element={<ProtectedRoute element={<PageOrders />} />} />
                            </Routes>
                        </div>
                    </div>
                </ErrorBoundary>
            </CartProvider>
        </Router>
    );
};

export default App;
