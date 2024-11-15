import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PageOrders.css';

interface Order {
    id: number;
    user_id: number;
    total: number;
    status: string;
    createdAt?: string;
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
                headers: {
                    'Content-Type': 'application/json',
                },
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
                const data = await response.json();
                setOrders(data);
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
                            <div className="order-card-header">
                                <span className="order-id">Ordine #{order.id}</span>
                                <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
                            </div>
                            <div className="order-card-body">
                                <p><strong>Totale:</strong> €{order.total.toFixed(2)}</p>
                                {order.createdAt && <p><strong>Data:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PageOrders;
