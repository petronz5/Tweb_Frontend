import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import ProductList from '../components/ProductList/ProductList';
import Filters from '../components/Filters/Filters';
import ProductDetails from '../components/ProductDetails/ProductDetails'; // Importa ProductDetails
import './PageProducts.css';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
    url_products: string;
}

const PageProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Nuovo stato
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
                const data: Product[] = await response.json();
                console.log('Dati prodotti:', data);
                setProducts(data);

                const params = new URLSearchParams(window.location.search);
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
    }, []);

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
        sortOrder: 'asc' | 'desc' | 'none';
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

    const handleDetailClick = (product: Product) => {
        setSelectedProduct(product); // Imposta il prodotto selezionato
    };

    const handleBackToList = () => {
        setSelectedProduct(null); // Torna alla lista dei prodotti
    };

    return (
        <div className="page-products-container">
            {error && <p className="error-message">Errore: {error}</p>}
            {!selectedProduct ? (
                <div className="filters-section">
                    <Filters onApplyFilters={handleApplyFilters} selectedCategory={selectedCategory}/>
                </div>) : (
                // vuoto, quando prodotto selezionato non si vede sezione filtri
                null
            )}

            <div className="products-section">
                {selectedProduct ? (
                    <ProductDetails product={selectedProduct} onBack={handleBackToList} />
                ) : (
                    <>
                        <SearchBar onSearch={handleSearch} />
                        <ProductList products={filteredProducts} onDetailClick={handleDetailClick} />
                    </>
                )}
            </div>
        </div>
    );
};

export default PageProducts;
