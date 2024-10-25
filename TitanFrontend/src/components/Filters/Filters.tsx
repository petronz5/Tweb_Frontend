import React, { useState, useEffect } from 'react';
import './Filters.css';

interface FiltersProps {
    onApplyFilters: (filters: { minPrice: number; maxPrice: number; categories: string[] }) => void;
}

const Filters: React.FC<FiltersProps> = ({ onApplyFilters }) => {
    const [minPrice, setMinPrice] = useState<number | ''>(0);
    const [maxPrice, setMaxPrice] = useState<number | ''>(1000);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8080/TitanCommerce/categories');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Errore nel caricamento delle categorie", error);
            }
        };

        fetchCategories();
    }, []);

    const handleApplyFilters = () => {
        onApplyFilters({ minPrice: Number(minPrice), maxPrice: Number(maxPrice), categories: selectedCategories });
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
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
                    <label key={category}>
                        <input
                            type="checkbox"
                            value={category}
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCategoryChange(category)}
                        />
                        {category}
                    </label>
                ))
            )}
            <button onClick={handleApplyFilters}>Applica Filtri</button>
        </div>
    );
};

export default Filters;
