'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { SpecialEventDetailDto } from '../../types/types';
import { MessagesGrid } from '../messages/MessagesGrid';

interface SpecialEventDetailProps {
  eventDetail: SpecialEventDetailDto | null;
  onBack: () => void;
}

export const SpecialEventDetail = ({
  eventDetail,
  onBack
}: SpecialEventDetailProps) => {
  if (!eventDetail) return null;

  const { messages } = eventDetail;

  return (
    <div className="space-y-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-text-secondary"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>一覧に戻る</span>
      </button>

      <MessagesGrid messages={messages} />
    </div>
  );
};
