type BadgeVariant = 'light' | 'modal' | 'outline';

interface BadgePattern {
  light: string;
  modal: string;
  outline: string;
}

const BADGE_PATTERNS: Record<string, BadgePattern> = {
  blue: {
    light: 'bg-badge-blue/20 text-badge-blue border-badge-blue/30 hover:bg-badge-blue/30 transition-all duration-ui',
    modal: 'bg-badge-blue/80 text-white border-badge-blue hover:bg-badge-blue transition-all duration-ui',
    outline: 'border-surface-border text-text-secondary hover:border-badge-blue hover:text-badge-blue hover:bg-badge-blue/10 transition-all duration-ui'
  },
  green: {
    light: 'bg-badge-green/20 text-badge-green border-badge-green/30 hover:bg-badge-green/30 transition-all duration-ui',
    modal: 'bg-badge-green/80 text-white border-badge-green hover:bg-badge-green transition-all duration-ui',
    outline: 'border-surface-border text-text-secondary hover:border-badge-green hover:text-badge-green hover:bg-badge-green/10 transition-all duration-ui'
  },
  orange: {
    light: 'bg-badge-orange/20 text-badge-orange border-badge-orange/30 hover:bg-badge-orange/30 transition-all duration-ui',
    modal: 'bg-badge-orange/80 text-white border-badge-orange hover:bg-badge-orange transition-all duration-ui',
    outline: 'border-surface-border text-text-secondary hover:border-badge-orange hover:text-badge-orange hover:bg-badge-orange/10 transition-all duration-ui'
  },
  purple: {
    light: 'bg-badge-purple/20 text-badge-purple border-badge-purple/30 hover:bg-badge-purple/30 transition-all duration-ui',
    modal: 'bg-badge-purple/80 text-white border-badge-purple hover:bg-badge-purple transition-all duration-ui',
    outline: 'border-surface-border text-text-secondary hover:border-badge-purple hover:text-badge-purple hover:bg-badge-purple/10 transition-all duration-ui'
  },
  gray: {
    light: 'bg-badge-gray/20 text-badge-gray border-badge-gray/30 hover:bg-badge-gray/30 transition-all duration-ui',
    modal: 'bg-badge-gray/80 text-white border-badge-gray hover:bg-badge-gray transition-all duration-ui',
    outline: 'border-surface-border text-text-secondary hover:border-accent-gold hover:text-accent-gold-dark hover:bg-accent-gold-light/50 transition-all duration-ui'
  }
};

/**
 * Create badge style based on color and variant
 * @param color - Badge color (blue, green, orange, purple, gray)
 * @param variant - Display variant (light, modal, outline)
 * @returns CSS class string for the badge
 */
export const createBadgeStyle = (color: string, variant: BadgeVariant): string => {
  const pattern = BADGE_PATTERNS[color] || BADGE_PATTERNS.gray;
  return pattern[variant];
};