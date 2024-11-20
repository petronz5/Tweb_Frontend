import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CartProvider } from './CartProvider';

interface CartProviderWrapperProps {
    children: React.ReactNode;
}

const CartProviderWrapper: React.FC<CartProviderWrapperProps> = ({ children }) => {
    const navigate = useNavigate();
    return (
        <CartProvider navigate={navigate}>
            {children}
        </CartProvider>
    );
};

export default CartProviderWrapper;
