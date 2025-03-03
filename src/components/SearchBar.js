import React, { useState } from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ handleSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const query = e.target.value;
    setQuery(query);
    handleSearch(query); // Pass the search query to the parent component
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search books by title, author, or genre..."
        value={query}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;