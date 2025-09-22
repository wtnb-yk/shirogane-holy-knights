import { createBadgeStyle } from '@/utils/badgeStyleUtils';

type BadgeVariant = 'light' | 'modal' | 'outline';

const EVENT_TYPE_COLOR_MAP: Record<string, string> = {
  event: 'blue',
  goods: 'orange',
  campaign: 'green'
};

/**
 * Get badge style for calendar event types
 * @param eventType - Event type (event, goods, campaign)
 * @param variant - Display variant (light, modal, outline)
 * @returns CSS class string for the badge
 */
export const getEventTypeBadgeStyle = (eventType: string, variant: BadgeVariant): string => {
  const color = EVENT_TYPE_COLOR_MAP[eventType.toLowerCase()] || 'gray';
  return createBadgeStyle(color, variant);
};