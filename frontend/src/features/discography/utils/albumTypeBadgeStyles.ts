import {BadgeColor, createBadgeStyle} from '@/utils/badgeStyleUtils';

type BadgeVariant = 'light' | 'modal' | 'outline';

const ALBUM_TYPE_COLOR_MAP: Record<string, BadgeColor> = {
  single: 'blue',
  album: 'green',
  compilation: 'orange',
  mini_album: 'purple',
  ep: 'purple'
};

/**
 * Get badge style for album types
 * @param typeName - Album type (single, album, compilation, mini_album, ep)
 * @param variant - Display variant (light, modal, outline)
 * @returns CSS class string for the badge
 */
export const getAlbumTypeBadgeStyle = (typeName: string, variant: BadgeVariant = 'light'): string => {
  const type = typeName.toLowerCase();
  const color = ALBUM_TYPE_COLOR_MAP[type] || 'gray';
  return createBadgeStyle(color, variant);
};

