'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import { SpecialEventDto } from '../../types/types';
import { InteractiveCard } from '@/components/Card/InteractiveCard';
import { StaggeredItem } from '@/components/Card/StaggeredItem';
import { SpecialEventCardDescription } from './internals/SpecialEventCardDescription';
import { formatDateSimple } from '@/utils/componentUtils';

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
        hoverScale="md"
        className="border-0 border-l-4 border-accent-gold rounded-lg bg-bg-primary p-6 cursor-pointer"
      >
        <div className="space-y-3">
          <SpecialEventCardDescription
            title={event.title}
            description={event.description}
          />

          <div className="flex justify-between items-center text-sm text-text-tertiary">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <span>{formatDateSimple(event.endDate)}</span>
            </div>
        </div>
        </div>
      </InteractiveCard>
    </StaggeredItem>
  );
};

SpecialEventCardComponent.displayName = 'SpecialEventCard';

export const SpecialEventCard = React.memo(SpecialEventCardComponent);
