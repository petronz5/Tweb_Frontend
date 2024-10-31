import React, { useState } from 'react';
import { useCart } from '../Cart/CartProvider.tsx'; // Importa il contesto del carrello
import './ProductList.css';

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    categoryId: number;
}

interface ProductListProps {
    products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
    const { addToCart } = useCart(); // Usa la funzione addToCart dal contesto
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

    // Funzione per aggiungere un prodotto al carrello
    const handleBuyClick = (product: Product) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
        });
    };

    return (
        <div className="filter-and-product-container">
            <div className="filters">
            </div>
            <div className="product-list-container">
                <div className="product-list">
                    {currentProducts.length > 0 ? (
                        currentProducts.map((product) => (
                            <div key={product.id} className="product-item">
                                <h4>{product.name}</h4>
                                <p>Prezzo: €{product.price}</p>
                                <p>Disponibilità: {product.stock}</p>
                                <div className="buttons">
                                    <button className="detail-button">Dettaglio</button>
                                    <button
                                        className="buy-button"
                                        onClick={() => handleBuyClick(product)} // Usa handleBuyClick qui
                                    >
                                        Acquista
                                    </button>
                                </div>
                            </div>
                        ))
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
