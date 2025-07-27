'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

interface SearchBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onFilterClick?: () => void;
  disabled?: boolean;
}

export const SearchBar = ({ 
  searchValue = '', 
  onSearchChange, 
  onFilterClick, 
  disabled = false 
}: SearchBarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8 flex flex-wrap gap-4"
    >
      <div className="flex-1 min-w-[300px] relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-300 w-5 h-5" />
        <input
          type="text"
          placeholder="タイトルで検索..."
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-sage-200 rounded-lg bg-white focus:ring-2 focus:ring-sage-300 focus:border-sage-300 transition-all duration-200 shadow-sm text-gray-800 placeholder-sage-300/70"
          disabled={disabled}
        />
      </div>
      <button 
        className="px-6 py-3 bg-white border border-sage-200 rounded-lg flex items-center gap-2 hover:bg-sage-100 transition-all duration-200 shadow-sm" 
        onClick={onFilterClick}
        disabled={disabled}
      >
        <Filter className="w-5 h-5 text-sage-300" />
        <span className="text-sage-300">フィルター</span>
      </button>
    </motion.div>
  );
};