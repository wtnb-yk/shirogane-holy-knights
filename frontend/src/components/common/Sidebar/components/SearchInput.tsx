'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput = ({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = "検索",
  className = ""
}: SearchInputProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(value.trim());
  };

  const handleClear = () => {
    onChange('');
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary w-4 h-4" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-9 pr-9 py-3 border border-surface-border rounded-lg text-sm focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition-all"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
};