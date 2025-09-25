import React from 'react';
import { Event } from '../../../types';
import { LinkText } from '@/components/ui/LinkText';

interface EventDescriptionProps {
  event: Event;
}

export function EventDescription({ event }: EventDescriptionProps) {
  if (!event.description && !event.url) {
    return null;
  }

  return (
    <div>
      {event.description ? (
        <p className="text-gray-200 whitespace-pre-line leading-relaxed">
          {event.description}
          {event.url && (
            <>
              <br />
              <span className="block text-right">
                <LinkText href={event.url}>
                  詳細を見る
                </LinkText>
              </span>
            </>
          )}
        </p>
      ) : (
        event.url && (
          <div className="text-right">
            <LinkText href={event.url}>
              詳細はこちら
            </LinkText>
          </div>
        )
      )}
    </div>
  );
}