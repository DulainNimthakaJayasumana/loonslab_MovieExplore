import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useMovies } from '../contexts/MovieContext';

interface SearchBarProps {
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className = '' }) => {
  const { searchQuery, setSearchQuery, searchForMovies, resetSearch } = useMovies();
  const [inputValue, setInputValue] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimeout = useRef<number | null>(null);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Clear existing timeout
    if (debounceTimeout.current) {
      window.clearTimeout(debounceTimeout.current);
    }
    
    // Set a new timeout for debouncing
    debounceTimeout.current = window.setTimeout(() => {
      if (value.trim()) {
        setSearchQuery(value);
        searchForMovies(value);
      } else {
        resetSearch();
      }
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      searchForMovies(inputValue);
    }
  };

  const clearSearch = () => {
    setInputValue('');
    resetSearch();
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for movies..."
          value={inputValue}
          onChange={handleInputChange}
          className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
        />
        {inputValue && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;