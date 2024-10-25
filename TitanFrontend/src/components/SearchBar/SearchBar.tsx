// SearchBar.tsx
import React, { useState } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void; // Il tipo corretto per onSearch
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        onSearch(query); // Qui chiamiamo onSearch con il valore della query
    };

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)} // Aggiorna la query con il valore dell'input
                placeholder="Cerca..."
            />
            <button onClick={handleSearch}>Cerca</button>
        </div>
    );
};

export default SearchBar;
