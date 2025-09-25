import React from 'react';
import { Calendar } from 'lucide-react';
import { formatDate } from '../../../utils/formatters';

interface DayEventsHeaderProps {
  date: Date;
}

export function DayEventsHeader({ date }: DayEventsHeaderProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <Calendar className="w-5 h-5 text-gray-300" />
      <h2 className="text-lg font-semibold text-white">{formatDate(date)}</h2>
    </div>
  );
}