'use client';

import React from 'react';
import { SearchInput } from '@/components/common/Sidebar/components/SearchInput';

interface CalendarSearchSectionProps {
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  title?: string;
}

export const CalendarSearchSection = ({
  searchValue,
  onSearch,
  onClearSearch,
  title = 'イベント検索',
}: CalendarSearchSectionProps) => {
  const [inputValue, setInputValue] = React.useState(searchValue);

  React.useEffect(() => {
    setInputValue(searchValue);
  }, [searchValue]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (!value) {
      onClearSearch();
    }
  };

  return (
    <div>
      <h3 className="text-base font-bold text-text-primary mb-3">
        {title}
      </h3>

      <SearchInput
        value={inputValue}
        onChange={handleInputChange}
        onSubmit={() => onSearch(inputValue.trim())}
        onClear={() => {
          setInputValue('');
          onClearSearch();
        }}
        placeholder="イベント・グッズを検索"
        className="mb-3"
      />
    </div>
  );
};