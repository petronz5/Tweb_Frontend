import React, { useState, useEffect } from 'react';
import './ProductList.css';
import Filters from '../Filters/Filters.tsx'; // Assicurati che il filtro sia importato correttamente

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
}

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filters, setFilters] = useState<{ minPrice: number; maxPrice: number; categories: string[] }>({
        minPrice: 0,
        maxPrice: 1000,
        categories: []
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:8080/TitanCommerce/products');
                const data = await response.json();
                setProducts(data);
                setFilteredProducts(data);
            } catch (error) {
                console.error("Errore nel caricamento dei prodotti", error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [filters, searchQuery, products]);

    const filterProducts = () => {
        let filtered = [...products];

        if (filters.minPrice) {
            filtered = filtered.filter(product => product.price >= filters.minPrice);
        }

        if (filters.maxPrice) {
            filtered = filtered.filter(product => product.price <= filters.maxPrice);
        }

        if (filters.categories.length > 0) {
            filtered = filtered.filter(product =>
                filters.categories.map(c => c.toLowerCase()).includes(product.category.toLowerCase())
            );
        }

        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
    };

    const handleApplyFilters = (newFilters: { minPrice: number; maxPrice: number; categories: string[] }) => {
        setFilters(newFilters);
    };

    return (
        <div className="product-list-container">
            {/* Tieni solo un'istanza del componente Filters */}
            <Filters onApplyFilters={handleApplyFilters} />

            <div className="product-list">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <div key={product.id} className="product-item">
                            <h4>{product.name}</h4>
                            <p>Prezzo: €{product.price}</p>
                            <p>Categoria: {product.category}</p>
                        </div>
                    ))
                ) : (
                    <p>Nessun prodotto trovato.</p>
                )}
            </div>
        </div>
    );
};

export default ProductList;
