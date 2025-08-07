'use client';

import React from 'react';
import { Play, ExternalLink, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OverlayIconProps {
  type: 'play' | 'external-link' | 'custom';
  icon?: LucideIcon;
  isVisible?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  backgroundClassName?: string;
  iconClassName?: string;
  'aria-label'?: string;
}

const sizeConfig = {
  sm: {
    icon: 'w-4 h-4',
    background: 'p-2'
  },
  md: {
    icon: 'w-6 h-6',
    background: 'p-3'
  },
  lg: {
    icon: 'w-8 h-8',
    background: 'p-4'
  }
};

const getIconComponent = (type: OverlayIconProps['type'], customIcon?: LucideIcon) => {
  switch (type) {
    case 'play':
      return Play;
    case 'external-link':
      return ExternalLink;
    case 'custom':
      return customIcon || Play;
    default:
      return Play;
  }
};

export const OverlayIcon: React.FC<OverlayIconProps> = ({
  type,
  icon: customIcon,
  isVisible = false,
  size = 'md',
  className,
  backgroundClassName,
  iconClassName,
  'aria-label': ariaLabel
}) => {
  const IconComponent = getIconComponent(type, customIcon);
  const config = sizeConfig[size];

  const defaultAriaLabel = type === 'play' ? '再生' : type === 'external-link' ? '外部リンクで開く' : '';

  return (
    <div 
      className={cn(
        'absolute inset-0 flex items-center justify-center transition-opacity duration-200',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
      aria-label={ariaLabel || defaultAriaLabel}
    >
      <div className={cn(
        'bg-black/50 rounded-full',
        config.background,
        backgroundClassName
      )}>
        <IconComponent 
          className={cn(
            'text-white',
            config.icon,
            type === 'play' && 'fill-white',
            iconClassName
          )}
        />
      </div>
    </div>
  );
};

OverlayIcon.displayName = 'OverlayIcon';