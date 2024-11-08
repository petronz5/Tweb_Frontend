import React, { useEffect, useState } from 'react';
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

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:8080/orders', {
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            } else {
                console.error('Failed to fetch orders, status:', response.status);
            }
        } catch (error) {
            console.error('Error fetching orders:', error.message);
        }
    };



    return (
        <div className="orders-container">
            <h1>Order List</h1>
            <table className="orders-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>User ID</th>
                    <th>Total</th>
                    <th>Status</th>
                    {/* Uncomment below if you want to display createdAt */}
                    {/* <th>Created At</th> */}
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.user_id}</td>
                        <td>{order.total}</td>
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
