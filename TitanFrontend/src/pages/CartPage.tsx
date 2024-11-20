// src/pages/CartPage.tsx
import { useEffect, useState } from 'react';
import { useCart } from '../components/Cart/CartProvider';
import { useNavigate } from "react-router-dom";
import './CartPage.css';

const CartPage = () => {
    const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
    const navigate = useNavigate();
    console.log("Carrello attuale in CartPage:", cart);

    const [quantities, setQuantities] = useState<{ [key: number]: number }>(
        Object.fromEntries(cart.map(item => [item.product_id, item.quantity || 1]))
    );

    // Stato per memorizzare lo stock dei prodotti
    const [productStocks, setProductStocks] = useState<{ [key: number]: number }>({});

    useEffect(() => {
        setQuantities(Object.fromEntries(cart.map(item => [item.product_id, item.quantity || 1])));
    }, [cart]);

    // Fetch dello stock dei prodotti nel carrello
    useEffect(() => {
        const fetchProductStocks = async () => {
            try {
                const productIds = cart.map(item => item.product_id);
                if (productIds.length === 0) return;

                const query = productIds.join(',');

                const response = await fetch(`http://localhost:8080/TitanCommerce/products?ids=${query}`, {
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`Errore nel recuperare i dettagli dei prodotti: ${response.statusText}`);
                }

                const data = await response.json();

                const stocks: { [key: number]: number } = {};
                data.forEach((product: any) => {
                    stocks[product.id] = product.stock;
                });

                setProductStocks(stocks);
            } catch (error) {
                console.error("Errore nel recuperare lo stock dei prodotti:", error);
            }
        };

        fetchProductStocks();
    }, [cart]);

    const handleQuantityChange = (product_id: number, quantity: number) => {
        const maxStock = productStocks[product_id] || 0;

        if (quantity < 1) {
            alert("La quantità deve essere almeno 1.");
            quantity = 1;
        } else if (quantity > maxStock) {
            alert(`La quantità non può superare lo stock disponibile (${maxStock}).`);
            quantity = maxStock;
        }

        setQuantities(prevState => ({
            ...prevState,
            [product_id]: quantity
        }));

        updateQuantity(product_id, quantity);
    };

    const handleRemoveClick = (product_id: number, name: string) => {
        if (window.confirm(`Sei sicuro di voler rimuovere ${name} dal carrello?`)) {
            removeFromCart(product_id);
            alert(`${name} è stato rimosso dal carrello.`);
        }
    };

    const subtotal = cart.reduce((total, item) => {
        const price = item.productPrice ?? 0;
        return total + price * (quantities[item.product_id] || 1);
    }, 0);

    const shipping = subtotal >= 80 ? 0 : (subtotal > 0 ? 4.99 : 0);
    const totalAmount = subtotal + shipping;

    const handleOrderConfirmation = () => {
        navigate('/payment', { state: { totalAmount } });
    };

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
                                <img
                                    src={item.url_products}
                                    alt={item.productName}
                                    className="item-image"
                                />
                                <div className="item-info">
                                    <div className="item-header">
                                        <span className="item-name">{item.productName}</span>
                                        <span className="item-price">€{item.productPrice.toFixed(2)}</span>
                                    </div>
                                    <p className="item-description">{item.description}</p>
                                    <div className="item-controls">
                                        <label htmlFor={`quantity-${item.product_id}`}>Quantità:</label>
                                        <input
                                            type="number"
                                            id={`quantity-${item.product_id}`}
                                            value={quantities[item.product_id] || 1}
                                            onChange={(e) => handleQuantityChange(
                                                item.product_id,
                                                parseInt(e.target.value) || 1
                                            )}
                                            min={1}
                                            max={productStocks[item.product_id] || 1000} // Imposta un valore massimo ragionevole
                                            step={1}
                                            list={`quantity-options-${item.product_id}`}
                                            className="quantity-input"
                                        />
                                        <datalist id={`quantity-options-${item.product_id}`}>
                                            {Array.from({ length: 9 }, (_, i) => i + 1).map((q) => (
                                                <option key={q} value={q} />
                                            ))}
                                        </datalist>
                                        <button
                                            className="remove-button"
                                            onClick={() => handleRemoveClick(item.product_id, item.productName)}
                                        >
                                            X
                                        </button>
                                    </div>
                                </div>
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
                    <button
                        className="place-order-button"
                        onClick={handleOrderConfirmation}
                        disabled={cart.length === 0}
                    >
                        Conferma
                    </button>
                    <button
                        className="empty-cart-button"
                        onClick={clearCart}
                        disabled={cart.length === 0}
                    >
                        Svuota carrello
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
