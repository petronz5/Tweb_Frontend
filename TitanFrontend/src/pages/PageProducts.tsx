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

    // Memorizza la categoria selezionata dai parametri della query
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:8080/TitanCommerce/products');
                if (!response.ok) {
                    throw new Error('Errore nel recupero dei prodotti');
                }
                const data = await response.json();
                setProducts(data);

                // Leggi il parametro della categoria dalla query string
                const params = new URLSearchParams(location.search);
                const categoryId = params.get('category');
                setSelectedCategory(categoryId); // Imposta la categoria selezionata

                if (categoryId) {
                    const filteredByCategory = data.filter(product => product.categoryId.toString() === categoryId);
                    setFilteredProducts(filteredByCategory);
                } else {
                    setFilteredProducts(data);
                }
            } catch (err) {
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

    const handleApplyFilters = (filters: { minPrice: number; maxPrice: number; categories: string[], inStock: boolean, sortOrder: 'asc' | 'desc' | 'none' }) => {
        let filtered = products.filter(
            (product) =>
                product.price >= filters.minPrice &&
                product.price <= filters.maxPrice &&
                (filters.categories.length === 0 || filters.categories.includes(product.categoryId.toString())) &&
                (!filters.inStock || product.stock > 0)
        );

        // Applica l'ordinamento solo se non è "none"
        if (filters.sortOrder === 'asc') {
            filtered = filtered.sort((a, b) => a.price - b.price);
        } else if (filters.sortOrder === 'desc') {
            filtered = filtered.sort((a, b) => b.price - a.price);
        }

        setFilteredProducts(filtered);
    };

    if (error) {
        return <p>Errore: {error}</p>;
    }

    return (
        <div className="page-products-container">
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
