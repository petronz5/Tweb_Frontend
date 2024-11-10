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
                // Gestisci il caso in cui l'utente non è autenticato
                alert('Sessione scaduta. Per favore, effettua nuovamente il login.');
                navigate('/login');
                return;
            } else if (response.status === 404) {
                // Gestisci il caso in cui non ci sono ordini o la risorsa non è trovata
                alert('Nessun ordine trovato.');
                return;
            } else if (!response.ok) {
                // Gestisci altri errori
                const errorText = await response.text();
                console.error('Errore nel caricamento degli ordini:', errorText);
                alert('Si è verificato un errore nel caricamento degli ordini. Riprova più tardi.');
                return;
            }

            const data = await response.json();
            setOrders(data);
        } catch (error: any) {
            console.error('Errore nella richiesta:', error);
            alert('Errore di rete. Controlla la tua connessione e riprova.');
        }
    };

    return (
        <div className="orders-container">
            <h1>Lista Ordini</h1>
            {orders.length === 0 ? (
                <p>Nessun ordine disponibile.</p>
            ) : (
                <table className="orders-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>User ID</th>
                        <th>Total</th>
                        <th>Status</th>
                        {/* <th>Created At</th> */}
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.user_id}</td>
                            <td>€{order.total.toFixed(2)}</td>
                            <td>{order.status}</td>
                            {/* <td>{order.createdAt}</td> */}
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PageOrders;
