import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface EventDetailHeaderProps {
  fromDayModal?: boolean;
  onBackToDayModal?: () => void;
}

export function EventDetailHeader({ fromDayModal = false, onBackToDayModal }: EventDetailHeaderProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      {fromDayModal && onBackToDayModal && (
        <button
          onClick={onBackToDayModal}
          className="text-white hover:text-gray-200 hover:bg-white/20 transition-all duration-200 flex items-center justify-center w-8 h-8 rounded -ml-1"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      <h2 className="text-lg font-semibold text-white">
        イベント詳細
      </h2>
    </div>
  );
}