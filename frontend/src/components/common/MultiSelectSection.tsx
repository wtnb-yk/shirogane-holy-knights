'use client';

import React from 'react';
import { MultiSelect } from '@/components/ui/MultiSelect';
import {BottomSheetSectionHeader} from "@/components/common/BottomSheetSectionHeader";

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
      <BottomSheetSectionHeader title={title} />
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
