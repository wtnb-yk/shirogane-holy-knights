import { Event } from '../types';

// イベントタイプと色のマッピング（一箇所で管理）
export const EVENT_TYPE_COLOR_MAP: Record<string, string> = {
  event: 'orange',
  goods: 'blue',
  campaign: 'pink',
  collaboration: 'green',
  others: 'gray'
};

// イベントバー用の色クラスを取得（透明度20%）
export function getEventColor(event: Event): string {
  const primaryType = event.eventTypes[0];
  const color = primaryType ? EVENT_TYPE_COLOR_MAP[primaryType.type] || 'gray' : 'gray';

  return `bg-badge-${color}/20 text-badge-${color} border-badge-${color}/30 hover:bg-badge-${color}/30`;
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export function isCurrentMonth(date: Date, currentMonth: number): boolean {
  return date.getMonth() === currentMonth;
}