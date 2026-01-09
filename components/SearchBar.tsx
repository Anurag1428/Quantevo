'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  suggestions?: string[];
}

export const SearchBar = ({
  placeholder = 'Search stocks, strategies...',
  onSearch,
  suggestions = [],
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  const handleChange = (value: string) => {
    setQuery(value);
    if (value && suggestions.length > 0) {
      const filtered = suggestions.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    if (onSearch) {
      onSearch(suggestion);
    }
    setFilteredSuggestions([]);
    setIsFocused(false);
  };

  const handleClear = () => {
    setQuery('');
    setFilteredSuggestions([]);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {isFocused && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-10">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              <Search className="w-4 h-4 inline mr-2 text-gray-500" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
