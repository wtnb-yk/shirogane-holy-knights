'use client';

import React from 'react';
import { MultiSelect } from '@/components/ui/MultiSelect';

interface MultiSelectSectionProps {
  value: string[];
  options: string[];
  onChange: (value: string[]) => void;
  title?: string;
  placeholder?: string;
}

export const MultiSelectSection = ({
  value,
  options,
  onChange,
  title = 'タグ',
  placeholder = '選択してください'
}: MultiSelectSectionProps) => {
  if (options.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <div className="w-1 h-4 bg-accent-gold rounded-full"></div>
        {title}
      </h4>
      <MultiSelect
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  );
};
