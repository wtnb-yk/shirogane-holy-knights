'use client';

import React, { useCallback, useMemo } from 'react';
import { SpecialEventDto } from '../../types/types';
import { ApiError } from '@/utils/apiClient';
import { SpecialsListGrid } from './internals/SpecialsListGrid';
import { SpecialEventCard } from '../cards/SpecialEventCard';
import { SkeletonSpecialEventCard } from '../cards/SkeletonSpecialEventCard';

interface SpecialsGridProps {
  events: SpecialEventDto[];
  loading: boolean;
  error: ApiError | null;
  onEventClick: (event: SpecialEventDto) => void;
}

const SpecialsGridComponent = ({
  events,
  loading,
  error,
  onEventClick
}: SpecialsGridProps) => {
  const renderItem = useCallback(
    (event: SpecialEventDto, index: number) => (
      <SpecialEventCard
        event={event}
        index={index}
        onEventClick={onEventClick}
      />
    ),
    [onEventClick]
  );

  const renderSkeleton = useCallback(
    (index: number) => <SkeletonSpecialEventCard index={index} />,
    []
  );

  const emptyMessage = useMemo(
    () => ({
      title: '現在開催中のスペシャルイベントはありません。',
      subtitle: ''
    }),
    []
  );

  return (
    <SpecialsListGrid
      items={events}
      loading={loading}
      error={error}
      renderItem={renderItem}
      renderSkeleton={renderSkeleton}
      emptyMessage={emptyMessage}
      skeletonCount={6}
    />
  );
};

SpecialsGridComponent.displayName = 'SpecialsGrid';

export const SpecialsGrid = React.memo(SpecialsGridComponent);
