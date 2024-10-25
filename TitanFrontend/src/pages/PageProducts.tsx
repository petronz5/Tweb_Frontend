import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import ProductList from '../components/ProductList/ProductList';
// Commenta o rimuovi CartProvider e Cart
// import { useCart } from '../components/Cart/CartProvider';
// import Cart from '../components/Cart/Cart';
import Filters from '../components/Filters/Filters'; // Mantieni solo un'istanza di Filters

const PageProducts: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    // Commenta l'utilizzo del carrello
    // const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:8080/TitanCommerce/products');
                if (!response.ok) {
                    throw new Error('Errore nel recupero dei prodotti');
                }
                const data = await response.json();
                setProducts(data);
                setFilteredProducts(data);
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
        setFilteredProducts(
            products.filter(
                (product) =>
                    product.price >= filters.minPrice &&
                    product.price <= filters.maxPrice &&
                    (filters.categories.length === 0 || filters.categories.includes(product.category))
            )
        );
    };

    if (error) {
        return <p>Errore: {error}</p>;
    }

    return (
        <div>
            <SearchBar onSearch={handleSearch} />
            {/* Mantieni un solo componente Filters */}
            <Filters onApplyFilters={handleApplyFilters} />
            <ProductList products={filteredProducts} /* addToCart={addToCart} */ />
            {/* Commenta o rimuovi il componente Cart */}
            {/* <Cart /> */}
        </div>
    );
};

export default PageProducts;
