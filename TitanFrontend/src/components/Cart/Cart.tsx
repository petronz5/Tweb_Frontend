import React from 'react';
import { useCart } from './CartProvider';

const Cart: React.FC = () => {
    const { cart, removeFromCart, clearCart } = useCart();


    console.log("Carrello attuale in Cart:", cart);

    if (cart.length === 0) {
        return <p>Il carrello è vuoto</p>;
    }

    return (
        <div>
            <h2>Il tuo Carrello</h2>
            <ul>
                {cart.map((item) => (
                    <li key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <img
                            src={item.url_products}
                            alt={item.productName}
                            style={{ width: '50px', height: '50px', marginRight: '10px' }}
                        />
                        <div>
                            <h4>{item.productName}</h4>
                            <p>{item.description}</p>
                            <p>€{item.productPrice.toFixed(2)} x {item.quantity}</p>
                            <button onClick={() => removeFromCart(item.product_id)}>Rimuovi</button>
                        </div>
                    </li>
                ))}
            </ul>
            <button onClick={clearCart}>Svuota carrello</button>
        </div>
    );
};

export default Cart;
