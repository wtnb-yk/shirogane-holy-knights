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
  placeholder = 'キーワードを入力してください'
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
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4 md:w-5 md:h-5" />
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        className="w-full pl-10 pr-12 py-2 md:py-3 border border-surface-border rounded-lg bg-bg-primary focus:ring-2 focus:ring-text-secondary focus:border-text-secondary transition-all duration-ui shadow-sm text-text-primary placeholder-text-secondary/70 text-sm md:text-base"
        disabled={disabled}
      />
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors duration-ui"
          disabled={disabled}
        >
          <X className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      )}
    </form>
  );
};