'use client';

import React, { useCallback } from 'react';
import { SelectableListHeader } from '@/components';
import { SelectableListItem } from '@/components';

interface SelectableListProps<T = string> {
  title?: string;
  items: readonly T[];
  selectedItems: readonly T[];
  onItemToggle: (item: T) => void;
  onClearAll: () => void;
  getDisplayName?: (item: T) => string;
  getItemKey?: (item: T) => string | number;
  allOptionLabel?: string;
  className?: string;
  loading?: boolean;
}

const SelectableListComponent = <T = string,>({
  title,
  items,
  selectedItems,
  onItemToggle,
  onClearAll,
  getDisplayName = (item: T) => String(item),
  getItemKey = (item: T) => String(item),
  allOptionLabel = 'すべて',
  className = '',
  loading = false,
}: SelectableListProps<T>) => {
  const handleItemToggle = useCallback((item: T) => {
    onItemToggle(item);
  }, [onItemToggle]);

  if (loading) {
    return (
      <div className={className}>
        <SelectableListHeader title={title} />
        <div className="space-y-1">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-8 bg-bg-tertiary rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <SelectableListHeader title={title} />
      <ul className="space-y-1" role="listbox">
        <SelectableListItem
          item={allOptionLabel}
          isSelected={selectedItems.length === 0}
          onToggle={() => onClearAll()}
          getDisplayName={(label: string) => label}
        />
        {items.map((item) => {
          const isItemSelected = selectedItems.some(selected => getItemKey(selected) === getItemKey(item));
          return (
            <SelectableListItem
              key={getItemKey(item)}
              item={item}
              isSelected={isItemSelected}
              onToggle={handleItemToggle}
              getDisplayName={getDisplayName}
            />
          );
        })}
      </ul>
    </div>
  );
};

export const SelectableList = React.memo(SelectableListComponent) as <T = string>(
  props: SelectableListProps<T>
) => React.ReactElement;
