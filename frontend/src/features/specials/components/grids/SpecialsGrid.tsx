'use client';

import React, { useCallback, useMemo } from 'react';
import { SpecialEventDto } from '../../types/types';
import { ApiError } from '@/utils/apiClient';
import { BaseGrid } from '@/components/Layout/BaseGrid';
import { SpecialEventCard } from '../cards/SpecialEventCard';
import { SkeletonSpecialEventCard } from '../cards/SkeletonSpecialEventCard';
import {
  getSpecialEventGridColumns,
  DEFAULT_EMPTY_MESSAGE,
  DEFAULT_SKELETON_COUNT
} from '../../config/gridConfig';
import { generateGridClassName } from '@/features/archives/utils/gridLayoutCalculator';

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
  // Memoize grid configuration
  const gridConfig = useMemo(() => {
    const gridColumns = getSpecialEventGridColumns();
    const gridClassName = generateGridClassName(gridColumns);
    return {
      columns: gridColumns,
      className: gridClassName.replace('grid ', '')
    };
  }, []);

  // Memoize render functions to prevent unnecessary re-renders
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

  // Memoize empty message
  const emptyMessage = useMemo(() => DEFAULT_EMPTY_MESSAGE, []);

  // BaseGrid は error: string | null を期待するので、ApiError を string に変換
  const errorMessage = useMemo(
    () => (error ? error.message : null),
    [error]
  );

  return (
    <BaseGrid
      items={events}
      loading={loading}
      error={errorMessage}
      renderItem={renderItem}
      renderSkeleton={renderSkeleton}
      emptyMessage={emptyMessage}
      skeletonCount={DEFAULT_SKELETON_COUNT}
      gridClassName={gridConfig.className}
    />
  );
};

SpecialsGridComponent.displayName = 'SpecialsGrid';

export const SpecialsGrid = React.memo(SpecialsGridComponent);
