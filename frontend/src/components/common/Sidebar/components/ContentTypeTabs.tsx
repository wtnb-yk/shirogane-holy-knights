'use client';

import React from 'react';

interface ContentTypeOption {
  key: string;
  label: string;
}

interface ContentTypeTabsProps {
  options: ContentTypeOption[];
  selectedType: string;
  onTypeChange: (type: string) => void;
  className?: string;
}

export const ContentTypeTabs = ({
  options,
  selectedType,
  onTypeChange,
  className = ""
}: ContentTypeTabsProps) => {
  return (
    <div className={className}>
      <div className="flex rounded-lg border border-surface-border p-1 bg-bg-secondary">
        {options.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onTypeChange(key)}
            className={`flex-1 py-2 px-3 text-sm font-medium transition-all rounded-md ${
              selectedType === key
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};