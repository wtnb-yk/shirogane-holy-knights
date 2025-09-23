'use client';

import React from 'react';

interface SelectableListItemProps<T> {
  item: T;
  isSelected: boolean;
  onToggle: (item: T) => void;
  getDisplayName: (item: T) => string;
}

export const SelectableListItem = <T,>({
  item,
  isSelected,
  onToggle,
  getDisplayName
}: SelectableListItemProps<T>) => {
  const baseButtonClasses = "w-full text-left py-2 px-3 rounded-md text-sm transition-all";
  const selectedClasses = "bg-accent-gold-light text-accent-gold-dark font-semibold";
  const unselectedClasses = "text-text-secondary hover:bg-accent-gold-light hover:pl-4";

  return (
    <li>
      <button
        onClick={() => onToggle(item)}
        className={`${baseButtonClasses} ${
          isSelected ? selectedClasses : unselectedClasses
        }`}
        role="option"
        aria-selected={isSelected}
      >
        {getDisplayName(item)}
      </button>
    </li>
  );
};