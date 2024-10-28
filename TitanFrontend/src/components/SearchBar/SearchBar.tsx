import React, { useState } from 'react';
import './SearchBar.css';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        onSearch(query);
    };

    return (
        <div className="search-bar-container">
            <input
                type="text"
                className="search-bar"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cerca..."
            />
            <button className="search-button" onClick={handleSearch}>
                Cerca
            </button>
        </div>
    );
};

export default SearchBar;
