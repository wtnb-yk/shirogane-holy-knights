'use client';

import React from 'react';
import { MessageDto } from '../../types/types';
import { formatDateTime } from '@/utils/componentUtils';

interface MessageCardProps {
  message: MessageDto;
}

const MessageCardComponent = ({ message }: MessageCardProps) => {
  return (
    <div className="border-l-4 border-accent-gold rounded-lg bg-bg-primary p-6">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-text-primary">
            {message.name}
          </h3>
          <span className="text-sm text-text-tertiary">
            {formatDateTime(message.createdAt)}
          </span>
        </div>
        <p className="text-text-secondary whitespace-pre-wrap">
          {message.message}
        </p>
      </div>
    </div>
  );
};

MessageCardComponent.displayName = 'MessageCard';

export const MessageCard = React.memo(MessageCardComponent);
