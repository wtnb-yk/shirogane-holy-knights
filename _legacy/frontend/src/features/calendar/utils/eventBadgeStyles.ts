import { createBadgeStyle, BadgeColor } from '@/utils/badgeStyleUtils';
import { EVENT_TYPE_COLOR_MAP as COLOR_MAP } from './eventUtils';

type BadgeVariant = 'light' | 'modal' | 'outline';

/**
 * Get badge style for calendar event types
 * @param eventType - Event type (event, goods, campaign)
 * @param variant - Display variant (light, modal, outline)
 * @returns CSS class string for the badge
 */
export const getEventTypeBadgeStyle = (eventType: string, variant: BadgeVariant): string => {
  const color: BadgeColor = (COLOR_MAP[eventType.toLowerCase()] || 'gray') as BadgeColor;
  return createBadgeStyle(color, variant);
};
