import React, { useState, useEffect } from 'react';
import './CategoryList.css';

// Interfaccia per rappresentare le categorie con nome e immagine
interface Category {
    id: number;
    name: string;
    image_url: string; // Aggiunto campo per l'URL dell'immagine dal DB
}

const CategoryList: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Effettua la chiamata API per ottenere le categorie
                const response = await fetch('http://localhost:8080/TitanCommerce/categories');
                if (!response.ok) {
                    throw new Error('Errore nel recupero delle categorie');
                }
                const data = await response.json();

                console.log("Dati delle categorie: ", data)
                // Setta le categorie direttamente con `imageUrl` dal database
                setCategories(data);
            } catch (err) {
                setError((err as Error).message);
            }
        };

        fetchCategories();
    }, []);

    // Gestione errore
    if (error) {
        return <p>Errore: {error}</p>;
    }

    return (
        <div className="category-list-container">
            {categories.length > 0 ? (
                <div className="category-grid">
                    {categories.map((category) => (
                        <div key={category.id} className="category-item">
                            {/* Usa direttamente `imageUrl` dal database per caricare l'immagine */}
                            <img
                                src={category.image_url}
                                alt={category.name}
                                className="category-image"
                            />
                            <h4>{category.name}</h4>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Caricamento delle categorie in corso...</p>
            )}
        </div>
    );
};

export default CategoryList;
