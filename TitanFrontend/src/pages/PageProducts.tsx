import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar/SearchBar';
import ProductList from '../components/ProductList/ProductList';
import Filters from '../components/Filters/Filters';
import './PageProducts.css';

const PageProducts: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const location = useLocation();

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log('Inizio fetch prodotti');
                const response = await fetch('http://localhost:8080/TitanCommerce/products', {
                    credentials: 'include', // Assicurati che il backend gestisca i cookie
                });
                console.log('Risposta ricevuta:', response);
                if (!response.ok) {
                    throw new Error(`Errore: ${response.statusText}`);
                }
                const data = await response.json();
                console.log('Dati prodotti:', data);
                setProducts(data);

                const params = new URLSearchParams(location.search);
                const categoryId = params.get('category');
                setSelectedCategory(categoryId);

                if (categoryId) {
                    const filteredByCategory = data.filter(product => product.categoryId.toString() === categoryId);
                    setFilteredProducts(filteredByCategory);
                } else {
                    setFilteredProducts(data);
                }
            } catch (err) {
                console.error('Errore nel fetch dei prodotti:', err);
                setError((err as Error).message);
            }
        };

        fetchProducts();
    }, [location.search]);

    const handleSearch = (query: string) => {
        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const handleApplyFilters = (filters: {
        minPrice: number;
        maxPrice: number;
        categories: string[];
        inStock: boolean;
        sortOrder: 'asc' | 'desc' | 'none'
    }) => {
        let filtered = products.filter(
            (product) =>
                product.price >= filters.minPrice &&
                product.price <= filters.maxPrice &&
                (filters.categories.length === 0 || filters.categories.includes(product.categoryId.toString())) &&
                (!filters.inStock || product.stock > 0)
        );

        if (filters.sortOrder === 'asc') {
            filtered = filtered.sort((a, b) => a.price - b.price);
        } else if (filters.sortOrder === 'desc') {
            filtered = filtered.sort((a, b) => b.price - a.price);
        }

        setFilteredProducts(filtered);
    };

    return (
        <div className="page-products-container">
            {error && <p className="error-message">Errore: {error}</p>}
            <div className="filters-section">
                <Filters onApplyFilters={handleApplyFilters} selectedCategory={selectedCategory} />
            </div>
            <div className="products-section">
                <SearchBar onSearch={handleSearch} />
                <ProductList products={filteredProducts} />
            </div>
        </div>
    );
};

export default PageProducts;
