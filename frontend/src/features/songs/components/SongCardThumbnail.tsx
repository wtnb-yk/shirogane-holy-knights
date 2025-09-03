'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Music, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SongCardThumbnailProps {
  videoId: string | null;
  title: string;
  size?: 'sm' | 'md' | 'lg';
  showPlayButton?: boolean;
  className?: string;
}

export const SongCardThumbnail = ({ 
  videoId, 
  title, 
  size = 'md', 
  showPlayButton = true,
  className 
}: SongCardThumbnailProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const sizeDimensions = {
    sm: { width: 48, height: 48 },
    md: { width: 64, height: 64 },
    lg: { width: 80, height: 80 }
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const playButtonSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  if (!videoId || imageError) {
    return (
      <div className={cn(
        sizeClasses[size],
        'flex items-center justify-center rounded-lg bg-accent-gold/20 flex-shrink-0',
        className
      )}>
        <Music className={cn(iconSizes[size], 'text-accent-gold')} />
      </div>
    );
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

  return (
    <div className={cn(
      sizeClasses[size],
      'relative rounded-lg overflow-hidden bg-bg-secondary flex-shrink-0 group',
      className
    )}>
      <Image
        src={thumbnailUrl}
        alt={`${title}のサムネイル`}
        width={sizeDimensions[size].width}
        height={sizeDimensions[size].height}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-200',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setImageError(true)}
        loading="lazy"
        unoptimized
      />
      
      {!isLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-secondary">
          <Music className={cn(iconSizes[size], 'text-text-tertiary animate-pulse')} />
        </div>
      )}

      {showPlayButton && isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="rounded-full bg-white/90 p-1">
            <Play className={cn(playButtonSizes[size], 'text-text-primary fill-current')} />
          </div>
        </div>
      )}
    </div>
  );
};