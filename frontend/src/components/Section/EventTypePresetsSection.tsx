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
      default:
        return type;
    }
  };

  // number[] → EventType[]の変換
  const selectedEventTypeObjects = useMemo(() =>
    eventTypes.filter(eventType => selectedEventTypes.includes(eventType.id)),
    [eventTypes, selectedEventTypes]
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
      items={eventTypes}
      selectedItems={selectedEventTypeObjects}
      onItemToggle={handleEventTypeToggle}
      onClearAll={handleClearAll}
      getDisplayName={(eventType) => getEventTypeLabel(eventType.type)}
      getItemKey={(eventType) => eventType.id}
      allOptionLabel="全て"
    />
  );
};
