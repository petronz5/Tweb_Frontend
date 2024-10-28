import React from 'react';

interface ProductProps {
    product: {
        id: number;
        name: string;
        description: string;
        price: number;
        imageUrl: string;
    };
    addToCart: (product: any) => void;
}

const Product: React.FC<ProductProps> = ({ product, addToCart }) => {
    return (
        <div className="product-card" style={styles.card}>
            <img src={product.imageUrl} alt={product.name} style={styles.image} />
            <h3>{product.name}</h3>
            <p>€{product.price.toFixed(2)}</p>
            <button onClick={() => addToCart(product)} style={styles.button}>
                Aggiungi al carrello
            </button>
        </div>
    );
};

const styles = {
    card: {
        border: '1px solid #ddd',
        padding: '16px',
        margin: '8px',
        borderRadius: '8px',
        textAlign: 'center',
    },
    image: {
        width: '100%',
        height: 'auto',
    },
    button: {
        padding: '8px 16px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default Product;
