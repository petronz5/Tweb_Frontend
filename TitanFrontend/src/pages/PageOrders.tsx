import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
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
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            } else if (response.status === 401) {
                // Gestisci il caso in cui l'utente non è autenticato
                alert('Sessione scaduta. Per favore, effettua nuovamente il login.');
                navigate('/login');
            } else {
                console.error('Failed to fetch orders, status:', response.status);
            }
        } catch (error: any) {
            console.error('Error fetching orders:', error.message);
        }
    };

    return (
        <div className="orders-container">
            <h1>Lista Ordini</h1>
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
        </div>
    );
};

export default PageOrders;