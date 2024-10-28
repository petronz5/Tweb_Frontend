// Home.tsx
import React from 'react';
import CategoryList from '../components/Category/CategoryList'; // Importiamo il componente

const Home: React.FC = () => {
    return (
        <div>
            <h1>Benvenuti in Titan Commerce!</h1>
            {/* Inseriamo la lista delle categorie */}
            <CategoryList />
        </div>
    );
};

export default Home;
