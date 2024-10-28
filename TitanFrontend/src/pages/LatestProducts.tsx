import React, { useState, useEffect } from 'react';
import './LatestProducts.css';

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    created_at: string; // Assicurati che il campo corrisponda al formato del timestamp
}

const LatestProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLatestProducts = async () => {
            try {
                const response = await fetch('http://localhost:8080/TitanCommerce/products');
                if (!response.ok) {
                    throw new Error('Errore nel recupero dei prodotti');
                }
                const data = await response.json();

                // Ordina i prodotti per data di creazione decrescente
                const sortedProducts = data.sort((a: Product, b: Product) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );

                // Prendi i 20 prodotti più recenti
                const latestProducts = sortedProducts.slice(0, 20);
                setProducts(latestProducts);
            } catch (err) {
                setError((err as Error).message);
            }
        };

        fetchLatestProducts();
    }, []);

    if (error) {
        return <p>Errore: {error}</p>;
    }

    return (
        <div className="latest-products-container">
            <h2>Ultimi Arrivi</h2>
            <div className="product-list">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id} className="product-item">
                            <h4>{product.name}</h4>
                            <p>Prezzo: €{product.price}</p>
                            <p>Disponibilità: {product.stock}</p>
                            <div className="buttons">
                                <button className="detail-button">Dettaglio</button>
                                <button className="buy-button">Acquista</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Nessun prodotto trovato.</p>
                )}
            </div>
        </div>
    );
};

export default LatestProducts;
