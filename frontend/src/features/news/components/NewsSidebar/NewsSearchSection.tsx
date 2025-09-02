'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface NewsSearchSectionProps {
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  title?: string;
}

export const NewsSearchSection = ({
  searchValue,
  onSearch,
  onClearSearch,
  title = 'ニュース検索',
}: NewsSearchSectionProps) => {
  const [inputValue, setInputValue] = React.useState(searchValue);

  React.useEffect(() => {
    setInputValue(searchValue);
  }, [searchValue]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (!value) {
      onClearSearch();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue.trim());
  };

  const handleClear = () => {
    setInputValue('');
    onClearSearch();
  };

  return (
    <div>
      <h3 className="text-base font-bold text-gray-900 mb-3">
        {title}
      </h3>

      <form onSubmit={handleSubmit} className="mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="気になるニュースを探す"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition-all"
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};