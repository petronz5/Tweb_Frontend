import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PageOrders.css';

interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    productName: string;
    productPrice: number;
    description: string;
    url_products: string;
}

interface Order {
    id: number;
    user_id: number;
    total: number;
    status: string;
    createdAt?: string;
    items: OrderItem[];
}

const PageOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:8080/TitanCommerce/orders', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.status === 401) {
                alert('Sessione scaduta. Per favore, effettua nuovamente il login.');
                navigate('/login');
            } else if (response.status === 404) {
                alert('Nessun ordine trovato.');
            } else if (!response.ok) {
                console.error('Errore nel caricamento degli ordini.');
                alert('Errore nel caricamento degli ordini. Riprova più tardi.');
            } else {
                const data: Order[] = await response.json();
                // Ordina gli ordini in base alla data
                const sortedData = data.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
                setOrders(sortedData);
            }
        } catch (error) {
            console.error('Errore nella richiesta:', error);
            alert('Errore di rete. Controlla la tua connessione e riprova.');
        }
    };

    return (
        <div className="orders-container">
            <h1>Lista Ordini</h1>
            <div className="orders-grid">
                {orders.length === 0 ? (
                    <p>Nessun ordine disponibile.</p>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-card-left">
                                <div className="order-card-header">
                                    <span className="order-id">Ordine #{order.id}</span>
                                </div>
                                <p><strong>Totale:</strong> €{order.total.toFixed(2)}</p>
                                {order.createdAt &&
                                    <p><strong>Data:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>}
                            </div>
                            <div className="order-card-right">
                                <h4>Prodotti:</h4>
                                <ul className="order-items">
                                    {order.items.map((item) => (
                                        <li key={item.product_id} className="order-item">
                                            <img src={item.url_products} alt={item.productName} className="order-item-image" />
                                            <div className="order-item-info">
                                                <span className="order-item-name">{item.productName}</span>
                                                <span className="order-item-description">{item.description}</span>
                                                <span className="order-item-quantity">Quantità: {item.quantity}</span>
                                                <span className="order-item-price">Prezzo Unitario: €{item.productPrice.toFixed(2)}</span>
                                                <span className="order-item-total">Totale: €{(item.productPrice * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};


export default PageOrders;
