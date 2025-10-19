'use client';

import React from 'react';
import { MessageDto } from '../../types/types';
import { MessageCard } from './MessageCard';

interface MessagesListProps {
  messages: MessageDto[];
}

export const MessagesList = ({ messages }: MessagesListProps) => {
  if (messages.length === 0) {
    return (
      <div className="text-center py-12 text-text-tertiary">
        <p>まだメッセージはありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-text-primary mb-6">メッセージ</h2>
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageCard key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
};
