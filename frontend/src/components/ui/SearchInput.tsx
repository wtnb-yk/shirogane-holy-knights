'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  onClearSearch?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export const SearchInput = ({ 
  searchValue = '', 
  onSearchChange, 
  onSearch,
  onClearSearch,
  disabled = false,
  placeholder = 'タイトルで検索...'
}: SearchInputProps) => {
  const [inputValue, setInputValue] = useState(searchValue);

  useEffect(() => {
    setInputValue(searchValue);
  }, [searchValue]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    onSearchChange?.(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(inputValue.trim());
  };

  const handleClear = () => {
    setInputValue('');
    onClearSearch?.();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-300 w-5 h-5" />
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        className="w-full pl-10 pr-12 py-3 border border-sage-200 rounded-lg bg-white focus:ring-2 focus:ring-sage-300 focus:border-sage-300 transition-all duration-200 shadow-sm text-gray-800 placeholder-sage-300/70"
        disabled={disabled}
      />
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sage-300 hover:text-gray-800 transition-colors duration-200"
          disabled={disabled}
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </form>
  );
};