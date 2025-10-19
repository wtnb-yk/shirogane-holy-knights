'use client';

import React from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import { SpecialEventDetailDto } from '../../types/types';
import { MessagesList } from '../messages/MessagesList';
import { ApiError } from '@/utils/apiClient';
import { formatDateRange } from '@/utils/componentUtils';

interface SpecialEventDetailProps {
  eventDetail: SpecialEventDetailDto | null;
  loading: boolean;
  error: ApiError | null;
  onBack: () => void;
}

export const SpecialEventDetail = ({
  eventDetail,
  loading,
  error,
  onBack
}: SpecialEventDetailProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">エラーが発生しました: {error.message}</p>
      </div>
    );
  }

  if (!eventDetail) {
    return (
      <div className="text-center py-12 text-text-tertiary">
        <p>イベントが見つかりません</p>
      </div>
    );
  }

  const { event, messages } = eventDetail;

  return (
    <div className="space-y-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-accent-gold hover:text-accent-gold-hover transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>一覧に戻る</span>
      </button>

      <div className="border-l-4 border-accent-gold rounded-lg bg-bg-primary p-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-text-primary">
            {event.title}
          </h1>

          <div className="flex items-center gap-2 text-text-tertiary">
            <Calendar className="w-5 h-5" />
            <span>
              {formatDateRange(event.startDate, event.endDate)}
            </span>
          </div>

          <div className="flex gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                event.status === 'active'
                  ? 'bg-green-500/20 text-green-400'
                  : event.status === 'upcoming'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-gray-500/20 text-gray-400'
              }`}
            >
              {event.status === 'active'
                ? '開催中'
                : event.status === 'upcoming'
                ? '開催予定'
                : '終了'}
            </span>
          </div>

          {event.description && (
            <p className="text-text-secondary whitespace-pre-wrap mt-4">
              {event.description}
            </p>
          )}
        </div>
      </div>

      <MessagesList messages={messages} />
    </div>
  );
};
