import React from 'react';
import { useCart } from './CartProvider';
import {useNavigate} from "react-router-dom";

const Cart: React.FC = () => {
    const { cart, removeFromCart, clearCart, submitOrder } = useCart();
    const navigate = useNavigate();

    console.log("Carrello attuale in Cart:", cart);

    if (cart.length === 0) {
        return <p>Il carrello è vuoto</p>;
    }

    return (
        <div>
            <h2>Il tuo Carrello</h2>
            <ul>
                {cart.map((item) => (
                    <li key={item.id}>
                        {item.productName} - €{item.productPrice.toFixed(2)} x {item.quantity}
                        <button onClick={() => removeFromCart(item.id)}>Rimuovi</button>
                    </li>
                ))}
            </ul>
            <button onClick={clearCart}>Svuota carrello</button>
            <button onClick={submitOrder}>Completa Acquisto</button>
        </div>
    );
};

export default Cart;
