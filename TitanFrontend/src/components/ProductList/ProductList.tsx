import React, { useState } from 'react';
import { useCart } from '../Cart/CartProvider.tsx'; // Importa il contesto del carrello
import './ProductList.css';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
    url_products: string;
    sconto: number;
}

interface ProductListProps {
    products: Product[];
    onDetailClick: (product: Product) => void; // Nuova prop
}

const ProductList: React.FC<ProductListProps> = ({ products, onDetailClick }) => {
    const { addToCart } = useCart(); // Usa la funzione addToCart dal contesto
    const isAuthenticated = !!sessionStorage.getItem("username")
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 18;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    const handleBuyClick = (product: Product) => {
        const newCartItem = {
            id: product.id,
            product_id: product.id,
            productName: product.name,
            productPrice: product.price,
            quantity: 1,
            description: product.description,
            url_products: product.url_products,
        };

        addToCart(newCartItem);
        alert(`${product.name} è stato aggiunto al carrello!`);
    };

    return (
        <div className="filter-and-product-container">
            <div className="product-list-container">
                <div className="product-list">
                    {currentProducts.length > 0 ? (
                        currentProducts.map((product) => {
                            const prezzoScontato = product.sconto > 0
                                ? product.price - (product.price * product.sconto / 100)
                                : product.price;
                            return (
                                <div key={product.id} className="product-item">
                                    <img src={product.url_products} alt={product.name} className="product-image" />
                                    <h4>{product.name}</h4>

                                    <p>
                                        Prezzo:
                                        <span className={product.sconto > 0 ? 'prezzo-originale' : ''}>
                        €{product.price.toFixed(2)}
                    </span>
                                        {product.sconto > 0 && (
                                            <>
                            <span className="prezzo-scontato">
                                €{prezzoScontato.toFixed(2)}
                            </span>
                                                <span className="sconto-etichetta">Sconto {product.sconto}%</span>
                                            </>
                                        )}
                                    </p>
                                    <p>Disponibilità: {product.stock}</p>
                                    <div className="buttons">
                                        <button
                                            className="detail-button"
                                            onClick={() => onDetailClick(product)}
                                        >
                                            Dettaglio
                                        </button>
                                        {product.stock > 0 ? (
                                            <button
                                                className="buy-button"
                                                onClick={() => handleBuyClick(product)}
                                                disabled={!isAuthenticated}
                                                title={!isAuthenticated ? 'Devi essere loggato per acquistare' : ''}
                                            >
                                                Acquista
                                            </button>
                                        ) : (
                                            <button
                                                className="preorder-button"
                                                disabled={!isAuthenticated}
                                                title={!isAuthenticated ? 'Devi essere loggato per preordinare' : ''}
                                            >
                                                Preordina
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>Nessun prodotto trovato.</p>
                    )}

                </div>
                <div className="pagination">
                    <button onClick={goToPreviousPage} disabled={currentPage === 1}>
                        Precedente
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageClick(index + 1)}
                            className={currentPage === index + 1 ? 'active' : ''}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button onClick={goToNextPage} disabled={currentPage === totalPages}>
                        Successivo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductList;