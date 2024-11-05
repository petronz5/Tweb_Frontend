import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
    url_products: string;
}

const ProductDetails: React.FC = () => {
    const [product, setProduct] = useState<Product | null>(null);
    const { productId } = useParams<{ productId: string }>();

    useEffect(() => {
        // fetch(`http://localhost:8080/TitanCommerce/products/${productId}`)
        //     .then(response => response.json())
        //     .then(data => setProduct(data))
        //     .catch(error => console.error('Error fetching product:', error));

        // Dati di esempio
        const sampleProduct: Product = {
            id: 1,
            name: 'Smartphone XYZ',
            description: 'Un fantastico smartphone con display AMOLED e fotocamera da 108MP.',
            price: 799.99,
            stock: 10,
            categoryId: 2,
            url_products: 'https://via.placeholder.com/400x400',
        };
        setProduct(sampleProduct);
    }, [productId]);

    const handleAddToCart = () => {
        if (product) {
            // Logica per aggiungere il prodotto al carrello
            alert(`${product.name} è stato aggiunto al carrello!`);
        }
    };

    if (!product) {
        return <div>Caricamento...</div>;
    }

    return (
        <div className="product-details-container">
            <div className="product-details">
                <div className="left-column">
                    <img src={product.url_products} alt={product.name} className="product-image" />
                </div>
                <div className="right-column">
                    <h1 className="product-title">{product.name}</h1>
                    <div className="product-price">€ {product.price.toFixed(2)}</div>
                    <div className="product-stock">
                        {product.stock > 0 ? `Unità disponibili: ${product.stock}` : 'Nessuna unità disponibile'}
                    </div>
                    <button
                        className="add-to-cart-button"
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                    >
                        Aggiungi al carrello
                        <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
                    </button>
                    <div className="product-description">
                        <h2>Descrizione</h2>
                        <p>{product.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
