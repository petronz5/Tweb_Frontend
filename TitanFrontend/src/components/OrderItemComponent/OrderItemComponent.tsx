// src/components/OrderItemComponent/OrderItemComponent.tsx
import React from 'react';
import './OrderItemComponent.css';

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

interface OrderItemComponentProps {
    item: OrderItem;
}

const OrderItemComponent: React.FC<OrderItemComponentProps> = ({ item }) => {
    return (
        <li className="order-item">
            <img src={item.url_products} alt={item.productName} className="order-item-image" />
            <div className="order-item-info">
                <span className="order-item-name">{item.productName}</span>
                <span className="order-item-description">{item.description}</span>
                <span className="order-item-quantity">Quantità: {item.quantity}</span>
                <span className="order-item-price">Prezzo Unitario: €{item.productPrice.toFixed(2)}</span>
            </div>
        </li>
    );
};

export default OrderItemComponent;
