'use client';

import React from 'react';
import { Play, Pause, Volume2, ExternalLink } from 'lucide-react';

interface OverlayIconProps {
  type: 'play' | 'pause' | 'volume' | 'external-link';
  isVisible?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const OverlayIcon = ({ 
  type, 
  isVisible = true, 
  className = '', 
  size = 'md' 
}: OverlayIconProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const IconComponent = {
    play: Play,
    pause: Pause,
    volume: Volume2,
    'external-link': ExternalLink
  }[type];

  return (
    <div 
      className={`
        absolute inset-0 flex items-center justify-center
        transition-opacity duration-300
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        ${className}
      `}
    >
      <div className={`
        ${sizeClasses[size]}
        bg-black/60 backdrop-blur-sm
        rounded-full flex items-center justify-center
        text-white
        transition-all duration-300
        hover:bg-black/80 hover:scale-110
      `}>
        <IconComponent className={iconSizeClasses[size]} />
      </div>
    </div>
  );
};