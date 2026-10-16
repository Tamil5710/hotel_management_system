import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({
  value = '',
  onChange,
  onSubmit,
  placeholder = 'Search by hotel name or location...',
  className = '',
  autoFocus = false,
}) => {
  const [query, setQuery] = useState(value);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleChange = (e) => {
    const newVal = e.target.value;
    setQuery(newVal);
    if (onChange) {
      onChange(newVal);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onChange) {
      onChange('');
    }
    if (onSubmit) {
      onSubmit('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSubmit) {
      e.preventDefault();
      onSubmit(query);
    }
  };

  return (
    <div className={`search-input-group ${className}`}>
      <Search className="search-icon-left" size={18} aria-hidden="true" />
      <input
        type="text"
        className="search-input-field"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        aria-label="Search hotels"
      />
      {query && (
        <button
          type="button"
          className="search-clear-btn"
          onClick={handleClear}
          aria-label="Clear search"
          title="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
