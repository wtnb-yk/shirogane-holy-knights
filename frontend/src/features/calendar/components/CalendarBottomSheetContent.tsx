'use client';

import React from 'react';
import { EventType } from '../types';

interface CalendarBottomSheetContentProps {
  selectedEventTypes: number[];
  onEventTypeChange: (types: number[]) => void;
  eventTypes: EventType[];
}

export function CalendarBottomSheetContent({
  selectedEventTypes,
  onEventTypeChange,
  eventTypes
}: CalendarBottomSheetContentProps) {

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'event':
        return 'イベント';
      case 'goods':
        return 'グッズ';
      case 'campaign':
        return 'キャンペーン';
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
    <>
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
    </>
  );
}