'use client';

import React, { useMemo } from 'react';
import { SelectableList } from '@/components/List/SelectableList';
import { EventType } from '@/features/calendar/types';

interface EventTypePresetsSectionProps {
  selectedEventTypes: number[];
  onEventTypeChange: (types: number[]) => void;
  eventTypes: EventType[];
}

export const EventTypePresetsSection = ({
  selectedEventTypes,
  onEventTypeChange,
  eventTypes
}: EventTypePresetsSectionProps) => {

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'event':
        return 'イベント';
      case 'goods':
        return 'グッズ';
      case 'campaign':
        return 'キャンペーン';
      case 'collaboration':
        return 'コラボ';
      case 'others':
        return 'その他';
      default:
        return type;
    }
  };

  const getEventTypeOrder = (type: string): number => {
    switch (type) {
      case 'event':
        return 1;
      case 'goods':
        return 2;
      case 'campaign':
        return 3;
      case 'collaboration':
        return 4;
      case 'others':
        return 5;
      default:
        return 99;
    }
  };

  const sortedEventTypes = useMemo(() =>
    [...eventTypes].sort((a, b) => getEventTypeOrder(a.type) - getEventTypeOrder(b.type)),
    [eventTypes]
  );

  // number[] → EventType[]の変換
  const selectedEventTypeObjects = useMemo(() =>
    sortedEventTypes.filter(eventType => selectedEventTypes.includes(eventType.id)),
    [sortedEventTypes, selectedEventTypes]
  );

  // 単一選択ロジック（EventType → number[]）
  const handleEventTypeToggle = (eventType: EventType) => {
    if (selectedEventTypes.includes(eventType.id)) {
      // 選択解除: 空配列に設定
      onEventTypeChange([]);
    } else {
      // 単一選択: そのタイプのみ選択
      onEventTypeChange([eventType.id]);
    }
  };

  const handleClearAll = () => {
    onEventTypeChange([]);
  };

  return (
    <SelectableList<EventType>
      title="タイプ"
      items={sortedEventTypes}
      selectedItems={selectedEventTypeObjects}
      onItemToggle={handleEventTypeToggle}
      onClearAll={handleClearAll}
      getDisplayName={(eventType) => getEventTypeLabel(eventType.type)}
      getItemKey={(eventType) => eventType.id}
      allOptionLabel="全て"
    />
  );
};
