'use client';

import React from 'react';

interface YearPresetsSectionProps {
  filters: {
    startDate?: string;
    endDate?: string;
  };
  onFiltersChange: (filters: any) => void;
  title?: string;
  minYear?: number;
}

export const YearPresetsSection = ({
  filters,
  onFiltersChange,
  title = '歌唱日',
  minYear = 2020,
}: YearPresetsSectionProps) => {
  const currentYear = new Date().getFullYear();
  const yearItems = [];
  
  for (let year = currentYear; year >= minYear; year--) {
    yearItems.push({
      id: `year-${year}`,
      label: `${year}年`,
      startDate: `${year}-01-01`,
      endDate: `${year}-12-31`
    });
  }

  const handleItemClick = (startDate?: string, endDate?: string) => {
    onFiltersChange({ 
      ...filters, 
      startDate, 
      endDate 
    });
  };

  const isSelected = (startDate?: string, endDate?: string) => {
    if (!startDate && !endDate) {
      return !filters?.startDate && !filters?.endDate;
    }
    return filters?.startDate === startDate && filters?.endDate === endDate;
  };

  return (
    <div>
      <h3 className="text-base font-bold text-text-primary mb-3">
        {title}
      </h3>

      <ul className="space-y-1">
        <li>
          <button
            onClick={() => handleItemClick(undefined, undefined)}
            className={`w-full text-left py-2 px-3 rounded-md text-sm transition-all ${
              isSelected(undefined, undefined)
                ? 'bg-accent-gold-light text-accent-gold-dark font-semibold'
                : 'text-text-secondary hover:bg-accent-gold-light hover:pl-4'
            }`}
          >
            すべて
          </button>
        </li>
        {yearItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => handleItemClick(item.startDate, item.endDate)}
              className={`w-full text-left py-2 px-3 rounded-md text-sm transition-all ${
                isSelected(item.startDate, item.endDate)
                  ? 'bg-accent-gold-light text-accent-gold-dark font-semibold'
                  : 'text-text-secondary hover:bg-accent-gold-light hover:pl-4'
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
