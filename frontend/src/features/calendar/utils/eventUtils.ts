import { Event } from '../types';

export function getEventColor(event: Event): string {
  const primaryType = event.eventTypes[0];
  if (!primaryType) return 'bg-badge-gray/20 text-badge-gray border-badge-gray/30';

  switch (primaryType.type) {
    case 'event':
      return 'bg-badge-blue/20 text-badge-blue border-badge-blue/30 hover:bg-badge-blue/30';
    case 'goods':
      return 'bg-badge-orange/20 text-badge-orange border-badge-orange/30 hover:bg-badge-orange/30';
    case 'campaign':
      return 'bg-badge-green/20 text-badge-green border-badge-green/30 hover:bg-badge-green/30';
    default:
      return 'bg-badge-gray/20 text-badge-gray border-badge-gray/30';
  }
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export function isCurrentMonth(date: Date, currentMonth: number): boolean {
  return date.getMonth() === currentMonth;
}