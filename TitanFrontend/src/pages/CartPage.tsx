import React, { useState, useEffect } from 'react';
import { useCart } from '../components/Cart/CartProvider';
import './CartPage.css';

const CartPage = () => {
    const { cart, removeFromCart, clearCart, submitOrder } = useCart();

    const [selectedItems, setSelectedItems] = useState<{ [key: number]: boolean }>(() => {
        const savedSelections = localStorage.getItem('selectedItems');
        return savedSelections ? JSON.parse(savedSelections) : {};
    });

    const [quantities, setQuantities] = useState<{ [key: number]: number }>(
        Object.fromEntries(cart.map(item => [item.id, item.quantity || 1]))
    );

    useEffect(() => {
        localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
    }, [selectedItems]);

    const handleSelectItem = (id: number) => {
        setSelectedItems(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const handleQuantityChange = (id: number, quantity: number) => {
        setQuantities(prevState => ({
            ...prevState,
            [id]: quantity
        }));
    };

    const subtotal = cart.reduce((total, item) => {
        return selectedItems[item.id] ? total + item.price * (quantities[item.id] || 1) : total;
    }, 0);

    const shipping = subtotal >= 80 ? 0 : (subtotal > 0 ? 4.99 : 0); // Spedizione a 0 se carrello vuoto
    const totalAmount = subtotal + shipping;

    return (
        <div className="cart-page">
            <div className="cart-items">
                <h2>Il tuo Carrello</h2>
                {cart.length === 0 ? (
                    <div className="empty-cart-message">
                        <p>Carrello vuoto, devi selezionare dei prodotti</p>
                    </div>
                ) : (
                    <ul>
                        {cart.map((item) => (
                            <li key={item.id} className="cart-item">
                                <input
                                    type="checkbox"
                                    checked={!!selectedItems[item.id]}
                                    onChange={() => handleSelectItem(item.id)}
                                />
                                <div className="item-info">
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-price">€{item.price.toFixed(2)}</span>
                                    <p className="item-description">{item.description}</p>
                                    <div className="item-quantity">
                                        <label htmlFor={`quantity-${item.id}`}>Quantità:</label>
                                        <select
                                            id={`quantity-${item.id}`}
                                            value={quantities[item.id] || 1}
                                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                        >
                                            {Array.from({ length: 9 }, (_, i) => i + 1).map((q) => (
                                                <option key={q} value={q}>{q}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <button className="remove-button" onClick={() => removeFromCart(item.id)}>Rimuovi</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="cart-summary">
                <h3>Riepilogo Ordine</h3>
                <div className="summary-item">
                    <span>Subtotale:</span>
                    <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                    <span>Spedizione:</span>
                    <span>€{shipping.toFixed(2)}</span>
                </div>
                <div className="summary-total">
                    <strong>Totale:</strong>
                    <strong className="total-amount">€{totalAmount.toFixed(2)}</strong>
                </div>
                <div className="cart-buttons">
                    <button className="clear-button" onClick={clearCart} disabled={cart.length === 0}>
                        Svuota carrello
                    </button>
                    <button className="confirm-button" onClick={submitOrder} disabled={cart.length === 0}>
                        Conferma Ordine
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
