'use client';

import React from 'react';
import { MultiSelect } from '@/components/ui/MultiSelect';

interface MultiSelectSectionProps {
  value: string[];
  options: string[];
  onChange: (value: string[]) => void;
  title?: string;
  placeholder?: string;
  loading?: boolean;
}

export const MultiSelectSection = ({
  value,
  options,
  onChange,
  title = 'タグ',
  placeholder = '選択してください',
  loading = false
}: MultiSelectSectionProps) => {
  if (options.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
        <div className="w-1 h-4 bg-accent-gold rounded-full"></div>
        {title}
      </h4>
      {loading ? (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-6 w-16 bg-bg-tertiary rounded animate-pulse"
            />
          ))}
        </div>
      ) : (
        <MultiSelect
          options={options}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full"
        />
      )}
    </div>
  );
};
