'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchInputProps } from '@/types/common';

/**
 * 統一された検索入力コンポーネント
 * 全ての検索機能で使用される共通コンポーネント
 */
export const SearchInput = ({ 
  searchValue = '', 
  onSearchChange, 
  onSearch,
  onClearSearch,
  disabled = false,
  placeholder = 'キーワードを入力してください',
  className,
  variant = 'default',
  size = 'md'
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
    onSearchChange?.('');
    onClearSearch?.();
  };

  // バリアント別のスタイル
  const variantStyles = {
    default: 'border-surface-border focus:ring-text-secondary focus:border-text-secondary',
    sidebar: 'border-surface-border focus:border-accent-gold focus:ring-accent-gold',
    compact: 'border-surface-border focus:ring-text-secondary focus:border-text-secondary'
  };

  // サイズ別のスタイル
  const sizeStyles = {
    sm: {
      input: 'pl-9 pr-9 py-2 text-sm',
      icon: 'w-4 h-4',
      iconLeft: 'left-2.5',
      iconRight: 'right-2.5'
    },
    md: {
      input: 'pl-10 pr-12 py-2 md:py-3 text-base',
      icon: 'w-4 h-4 md:w-5 md:h-5',
      iconLeft: 'left-3',
      iconRight: 'right-3'
    },
    lg: {
      input: 'pl-12 pr-14 py-3 md:py-4 text-lg',
      icon: 'w-5 h-5 md:w-6 md:h-6',
      iconLeft: 'left-4',
      iconRight: 'right-4'
    }
  };

  const currentSize = sizeStyles[size];
  const currentVariant = variantStyles[variant];

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <Search className={cn(
        'absolute top-1/2 transform -translate-y-1/2 text-text-secondary',
        currentSize.icon,
        currentSize.iconLeft
      )} />
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        className={cn(
          'w-full rounded-lg bg-bg-primary transition-all duration-200 shadow-sm text-text-primary placeholder-text-secondary/70',
          currentSize.input,
          currentVariant,
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        disabled={disabled}
      />
      {inputValue && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            'absolute top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors duration-200',
            currentSize.icon,
            currentSize.iconRight
          )}
          aria-label="検索をクリア"
        >
          <X className={currentSize.icon} />
        </button>
      )}
    </form>
  );
};