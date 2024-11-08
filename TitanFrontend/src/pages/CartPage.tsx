import React, { useEffect, useState } from 'react';
import { useCart } from '../components/Cart/CartProvider';
import './CartPage.css';

const CartPage = () => {
    const { cart, removeFromCart, clearCart, submitOrder, updateQuantity } = useCart();
    console.log("Carrello attuale in CartPage:", cart);

    // Inizializza lo stato delle quantità basato sugli articoli nel carrello
    const [quantities, setQuantities] = useState<{ [key: number]: number }>(
        Object.fromEntries(cart.map(item => [item.product_id, item.quantity || 1]))
    );

    // Aggiorna `quantities` quando `cart` cambia
    useEffect(() => {
        setQuantities(Object.fromEntries(cart.map(item => [item.product_id, item.quantity || 1])));
    }, [cart]);

    // Gestisce il cambio di quantità per un prodotto specifico
    const handleQuantityChange = (product_id: number, quantity: number) => {
        setQuantities(prevState => ({
            ...prevState,
            [product_id]: quantity
        }));
        updateQuantity(product_id, quantity); // Aggiorna la quantità nel carrello tramite il provider
    };

    // Gestisce la rimozione di un prodotto dal carrello
    const handleRemoveClick = (product_id: number, name: string) => {
        if (window.confirm(`Sei sicuro di voler rimuovere ${name} dal carrello?`)) {
            removeFromCart(product_id);
            alert(`${name} è stato rimosso dal carrello.`);
        }
    };

    // Calcola il subtotale in base alla quantità attuale degli articoli
    const subtotal = cart.reduce((total, item) => {
        const price = item.productPrice ?? 0;
        return total + price * (quantities[item.product_id] || 1);
    }, 0);

    // Calcola il costo di spedizione
    const shipping = subtotal >= 80 ? 0 : (subtotal > 0 ? 4.99 : 0);
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
                        {cart.map((item, index) => (
                            <li key={`${item.product_id}-${index}`} className="cart-item">
                                <div className="item-info">
                                    <span className="item-name">{item.productName}</span> {/* Nome del prodotto */}
                                    <span className="item-price">
                    €{item.productPrice.toFixed(2)} {/* Prezzo del prodotto */}
                </span>
                                    <p className="item-description">{item.description}</p>
                                    <div className="item-quantity">
                                        <label htmlFor={`quantity-${item.product_id}`}>Quantità:</label>
                                        <select
                                            id={`quantity-${item.product_id}`}
                                            value={quantities[item.product_id] || 1} // Usa `product_id` come chiave
                                            onChange={(e) => handleQuantityChange(item.product_id, parseInt(e.target.value))}
                                        >
                                            {Array.from({ length: 9 }, (_, i) => i + 1).map((q) => (
                                                <option key={q} value={q}>{q}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <button className="remove-button" onClick={() => handleRemoveClick(item.product_id, item.productName)}>Rimuovi</button>
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
