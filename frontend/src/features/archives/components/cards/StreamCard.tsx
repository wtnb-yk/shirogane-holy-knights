'use client';

import React from 'react';
import { StreamDto } from '../../types/types';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { StaggeredItem } from '@/components/ui/StaggeredItem';
import { ArchiveCardImage } from './internals/ArchiveCardImage';
import { ArchiveCardBadge } from './internals/ArchiveCardBadge';
import { ArchiveCardOverlay } from './internals/ArchiveCardOverlay';
import { formatDate } from '../../utils/dateFormat';

interface StreamCardProps {
  stream: StreamDto;
  index: number;
  variant?: 'default' | 'featured' | 'pickup';
}

const StreamCardComponent = ({ stream, index, variant = 'default' }: StreamCardProps) => {
  const isLarge = variant === 'featured' || variant === 'pickup';
  const date = stream.startedAt
    ? formatDate(stream.startedAt)
    : '配信日未定';

  return (
    <StaggeredItem index={index} className={`group ${isLarge ? 'col-span-2 row-span-2' : ''}`}>
      <InteractiveCard
        href={stream.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${stream.title}をYouTubeで視聴`}
        hoverScale="sm"
        className="overflow-hidden h-full"
      >
        <div className="relative">
          <ArchiveCardImage
            thumbnailUrl={stream.thumbnailUrl}
            title={stream.title}
            loading={variant === 'featured' ? 'eager' : 'lazy'}
            priority={variant === 'featured'}
            sizes={isLarge ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"}
          />

          <ArchiveCardBadge variant={variant} />

          <ArchiveCardOverlay
            title={stream.title}
            date={date}
            tags={stream.tags}
            type="stream"
          />
        </div>
      </InteractiveCard>
    </StaggeredItem>
  );
};

StreamCardComponent.displayName = 'StreamCard';

export const StreamCard = React.memo(StreamCardComponent);
