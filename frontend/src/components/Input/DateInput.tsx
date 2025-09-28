'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { DateInputProps } from '@/types/common';

/**
 * 統一された日付入力コンポーネント
 * 単一の日付選択に特化した基本コンポーネント
 */
export const DateInput = ({
  value = '',
  onChange,
  label,
  placeholder,
  disabled = false,
  className,
  variant = 'default',
  size = 'md',
  'aria-label': ariaLabel,
  ...props
}: DateInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  // バリアント別のスタイル
  const variantStyles = {
    default: 'border-surface-border focus:ring-text-secondary focus:border-text-secondary',
    sidebar: 'border-surface-border focus:border-accent-gold focus:ring-accent-gold/20',
    compact: 'border-surface-border focus:ring-text-secondary focus:border-text-secondary'
  };

  // サイズ別のスタイル
  const sizeStyles = {
    sm: 'px-2.5 py-1.5 text-sm',
    md: 'px-3 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const inputId = React.useId();
  const labelText = label || ariaLabel;

  return (
    <div className={cn('w-full', className)}>
      {labelText && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-text-primary mb-1"
        >
          {labelText}
        </label>
      )}
      <input
        id={inputId}
        type="date"
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel || labelText}
        className={cn(
          'w-full border rounded-lg bg-white transition-all duration-200 text-text-primary',
          'focus:outline-none focus:ring-2 [-webkit-appearance:none]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size]
        )}
        {...props}
      />
    </div>
  );
};