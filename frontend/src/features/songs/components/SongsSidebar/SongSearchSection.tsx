'use client';

import React from 'react';
import { Search, X, Settings } from 'lucide-react';

interface SongSearchSectionProps {
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  onOptionsClick: () => void;
  hasActiveOptions: boolean;
  title?: string;
}

export const SongSearchSection = ({
  searchValue,
  onSearch,
  onClearSearch,
  onOptionsClick,
  hasActiveOptions,
  title = '楽曲検索',
}: SongSearchSectionProps) => {
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
            placeholder="楽曲名・アーティスト名を入力"
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
      
      <button
        onClick={onOptionsClick}
        className={`w-full py-2.5 px-4 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all border ${
          hasActiveOptions
            ? 'border-text-secondary text-text-secondary bg-text-secondary/10 hover:bg-text-secondary/20'
            : 'border-surface-border text-text-secondary bg-white hover:text-text-primary hover:border-text-secondary hover:bg-bg-accent/20'
        }`}
      >
        <Settings className="w-4 h-4" />
        <span>検索オプション</span>
        {hasActiveOptions && (
          <span className="ml-1 w-2 h-2 bg-text-secondary rounded-full"></span>
        )}
      </button>
    </div>
  );
};
