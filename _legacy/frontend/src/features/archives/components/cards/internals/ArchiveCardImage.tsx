'use client';

import React from 'react';
import { OptimizedImage } from '@/components/Image/OptimizedImage';

interface ArchiveCardImageProps {
  thumbnailUrl?: string | null;
  title: string;
  priority?: boolean;
  sizes: string;
}

export const ArchiveCardImage = ({
  thumbnailUrl,
  title,
  priority = false,
  sizes,
}: ArchiveCardImageProps) => {
  if (thumbnailUrl) {
    return (
      <div className="relative w-full aspect-video overflow-hidden bg-black">
        <OptimizedImage
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={priority}
          sizes={sizes}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video overflow-hidden bg-bg-accent" />
  );
};
