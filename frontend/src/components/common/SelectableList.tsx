'use client';

import React, { useCallback } from 'react';
import { SelectableListHeader } from './SelectableListHeader';
import { SelectableListItem } from './SelectableListItem';

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
}: SelectableListProps<T>) => {
  const handleItemToggle = useCallback((item: T) => {
    onItemToggle(item);
  }, [onItemToggle]);

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
