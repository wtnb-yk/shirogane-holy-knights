'use client';

import React from 'react';
import { SpecialEventDto } from '../../types/types';
import { InteractiveCard } from '@/components/Card/InteractiveCard';
import { StaggeredItem } from '@/components/Card/StaggeredItem';
import { SpecialEventCardDescription } from './internals/SpecialEventCardDescription';
import { SpecialEventStatusBadge } from './internals/SpecialEventStatusBadge';

interface SpecialEventCardProps {
  event: SpecialEventDto;
  index: number;
  onEventClick: (event: SpecialEventDto) => void;
}

const SpecialEventCardComponent = ({ event, index, onEventClick }: SpecialEventCardProps) => {
  return (
    <StaggeredItem index={index}>
      <InteractiveCard
        onClick={() => onEventClick(event)}
        hoverScale="sm"
        className="border-0 rounded-lg bg-bg-primary p-6 cursor-pointer"
      >
        <div>
          <SpecialEventCardDescription
            title={event.title}
            description={event.description}
          />

          <div className="flex justify-between items-center text-sm text-text-tertiary">
            <span>{new Date(event.startDate).toLocaleDateString('ja-JP')}</span>
            <SpecialEventStatusBadge status={event.status} />
          </div>
        </div>
      </InteractiveCard>
    </StaggeredItem>
  );
};

SpecialEventCardComponent.displayName = 'SpecialEventCard';

export const SpecialEventCard = React.memo(SpecialEventCardComponent);
