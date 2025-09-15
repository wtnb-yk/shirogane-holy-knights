'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { EventType } from '../types';

interface CalendarBottomSheetContentProps {
  selectedEventTypes: number[];
  onEventTypeChange: (types: number[]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  eventTypes: EventType[];
}

export function CalendarBottomSheetContent({
  selectedEventTypes,
  onEventTypeChange,
  searchQuery,
  onSearchChange,
  eventTypes
}: CalendarBottomSheetContentProps) {
  const [inputValue, setInputValue] = React.useState(searchQuery);

  React.useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (!value) {
      onSearchChange('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(inputValue.trim());
  };

  const handleClear = () => {
    setInputValue('');
    onSearchChange('');
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'event':
        return 'イベント';
      case 'goods':
        return 'グッズ';
      default:
        return type;
    }
  };

  const handleEventTypeToggle = (typeId: number) => {
    if (selectedEventTypes.includes(typeId)) {
      // 同じタイプをクリックした場合は選択解除
      onEventTypeChange([]);
    } else {
      // 異なるタイプをクリックした場合は、そのタイプのみを選択
      onEventTypeChange([typeId]);
    }
  };

  const handleClearAll = () => {
    onEventTypeChange([]);
  };

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="p-3">
        <div className="space-y-6">
          {/* イベント検索セクション */}
          <div>
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-text-tertiary w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="イベント・グッズを検索"
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-full pl-8 pr-8 py-2 border border-surface-border rounded-md text-sm focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition-all"
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* タイプセクション */}
          <div>
            <h3 className="text-sm font-bold text-text-primary mb-2">タイプ</h3>
            <div className="space-y-2">
              {/* 全てクリアボタン */}
              <button
                onClick={handleClearAll}
                className={`w-full py-2 px-3 rounded-md text-sm transition-all text-left ${
                  selectedEventTypes.length === 0
                    ? 'bg-accent-gold-light text-accent-gold-dark font-semibold'
                    : 'text-text-secondary hover:bg-accent-gold-light hover:pl-4'
                }`}
              >
                全て
              </button>

              {/* イベントタイプボタン */}
              {eventTypes.map((eventType) => {
                const isSelected = selectedEventTypes.includes(eventType.id);
                return (
                  <button
                    key={eventType.id}
                    onClick={() => handleEventTypeToggle(eventType.id)}
                    className={`w-full py-2 px-3 rounded-md text-sm transition-all text-left ${
                      isSelected
                        ? 'bg-accent-gold-light text-accent-gold-dark font-semibold'
                        : 'text-text-secondary hover:bg-accent-gold-light hover:pl-4'
                    }`}
                  >
                    {getEventTypeLabel(eventType.type)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}