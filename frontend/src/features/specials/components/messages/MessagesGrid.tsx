'use client';

import React, { useCallback, useMemo } from 'react';
import { MessageDto } from '../../types/types';
import { MessageCard } from './MessageCard';
import { BaseGrid } from '@/components/Layout/BaseGrid';

interface MessagesGridProps {
  messages: MessageDto[];
}

const MessagesGridComponent = ({ messages }: MessagesGridProps) => {
  // Memoize render functions to prevent unnecessary re-renders
  const renderItem = useCallback(
    (message: MessageDto) => (
      <MessageCard message={message} />
    ),
    []
  );

  const renderSkeleton = useCallback(
    () => (
      <div className="border-l-4 border-accent-gold rounded-lg bg-bg-primary p-6 animate-pulse">
        <div className="space-y-3">
          <div className="h-6 bg-bg-secondary rounded w-1/3"></div>
          <div className="h-4 bg-bg-secondary rounded w-full"></div>
          <div className="h-4 bg-bg-secondary rounded w-5/6"></div>
        </div>
      </div>
    ),
    []
  );

  // Memoize empty message
  const emptyMessage = useMemo(
    () => ({
      title: 'まだメッセージはありません',
      subtitle: 'メッセージが投稿されるとここに表示されます'
    }),
    []
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-text-primary mb-6">メッセージ</h2>
      <BaseGrid
        items={messages}
        loading={false}
        error={null}
        renderItem={renderItem}
        renderSkeleton={renderSkeleton}
        emptyMessage={emptyMessage}
        skeletonCount={3}
        gridClassName="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      />
    </div>
  );
};

MessagesGridComponent.displayName = 'MessagesGrid';

export const MessagesGrid = React.memo(MessagesGridComponent);
