import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import ProductList from '../components/ProductList/ProductList';
import Filters from '../components/Filters/Filters'; // Mantieni solo un'istanza di Filters
//import './PageProducts.css'; // Importa uno stile personalizzato per il layout

const PageProducts: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:8080/TitanCommerce/products');
                if (!response.ok) {
                    throw new Error('Errore nel recupero dei prodotti');
                }
                const data = await response.json();
                setProducts(data);
                setFilteredProducts(data); // Inizialmente nessun filtro
            } catch (err) {
                setError((err as Error).message);
            }
        };

        fetchProducts();
    }, []);

    const handleSearch = (query: string) => {
        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const handleApplyFilters = (filters: { minPrice: number; maxPrice: number; categories: string[] }) => {
        const filtered = products.filter(
            (product) =>
                product.price >= filters.minPrice &&
                product.price <= filters.maxPrice &&
                (filters.categories.length === 0 || filters.categories.includes(product.category))
        );
        setFilteredProducts(filtered); // Aggiorna solo i prodotti filtrati
    };

    if (error) {
        return <p>Errore: {error}</p>;
    }

    return (
        <div className="page-products-container">
            {/* Sezione Filtri */}
            <div className="filters-section">
                <Filters onApplyFilters={handleApplyFilters} />
            </div>

            {/* Sezione Prodotti */}
            <div className="products-section">
                <SearchBar onSearch={handleSearch} />
                <ProductList products={filteredProducts} />
            </div>
        </div>
    );
};

export default PageProducts;
