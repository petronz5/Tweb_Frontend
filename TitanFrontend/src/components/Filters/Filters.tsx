import React, { useState, useEffect } from 'react';
import './Filters.css';

interface Category {
    id: number;
    name: string;
}

interface FiltersProps {
    onApplyFilters: (filters: {
        minPrice: number;
        maxPrice: number;
        categories: string[];
        inStock: boolean;
        sortOrder: 'asc' | 'desc' | 'none'
    }) => void;
    selectedCategory?: string | null;
}

const Filters: React.FC<FiltersProps> = ({ onApplyFilters, selectedCategory }) => {
    const [minPrice, setMinPrice] = useState<number | ''>(0);
    const [maxPrice, setMaxPrice] = useState<number | ''>(1000);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [showInStock, setShowInStock] = useState(false);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8080/TitanCommerce/categories');
                if (!response.ok) {
                    throw new Error(`Errore nel recupero delle categorie: ${response.statusText}`);
                }
                const data: Category[] = await response.json();
                setCategories(data);

                // Pre-seleziona la categoria se è passata tramite props
                if (selectedCategory) {
                    setSelectedCategories([selectedCategory]);
                }
            } catch (error) {
                console.error("Errore nel caricamento delle categorie", error);
            }
        };

        fetchCategories();
    }, [selectedCategory]);

    const handleApplyFilters = () => {
        const appliedFilters = {
            minPrice: typeof minPrice === 'number' ? minPrice : 0,
            maxPrice: typeof maxPrice === 'number' ? maxPrice : 1000,
            categories: selectedCategories,
            inStock: showInStock,
            sortOrder: sortOrder
        };
        onApplyFilters(appliedFilters);
    };

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId) ? prev.filter((c) => c !== categoryId) : [...prev, categoryId]
        );
    };

    return (
        <div className="filters-container">
            <h4>Filtra per Prezzo</h4>
            <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value) || '')}
                placeholder="Prezzo minimo"
                min="0"
            />
            <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value) || '')}
                placeholder="Prezzo massimo"
                min="0"
            />

            <h4>Filtra per Categoria</h4>
            {categories.length === 0 ? (
                <p>Caricamento categorie...</p>
            ) : (
                categories.map((category) => (
                    <label key={category.id}>
                        <input
                            type="checkbox"
                            value={category.id.toString()}
                            checked={selectedCategories.includes(category.id.toString())}
                            onChange={() => handleCategoryChange(category.id.toString())}
                        />
                        {category.name}
                    </label>
                ))
            )}

            <h4>Disponibilità</h4>
            <label>
                <input
                    type="checkbox"
                    checked={showInStock}
                    onChange={() => setShowInStock((prev) => !prev)}
                />
                Solo prodotti disponibili
            </label>

            <h4>Ordinamento</h4>
            <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc' | 'none')}
            >
                <option value="none">Senza Ordinamento</option>
                <option value="asc">Prezzo: dal più basso</option>
                <option value="desc">Prezzo: dal più alto</option>
            </select>

            <button onClick={handleApplyFilters}>Applica Filtri</button>
        </div>
    );
};

export default Filters;
