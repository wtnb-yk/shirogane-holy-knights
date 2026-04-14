'use client';

import React from 'react';
import { OptimizedImage } from '@/components/Image/OptimizedImage';
import { OverlayIcon } from '@/components/Overlay/OverlayIcon';

interface NewsCardImageProps {
  imageUrl: string;
  alt: string;
}

export const NewsCardImage = ({ imageUrl, alt }: NewsCardImageProps) => {
  return (
    <div className="relative w-full md:w-80 h-48 md:h-[200px] flex-shrink-0 overflow-hidden bg-bg-accent">
      <OptimizedImage
        src={imageUrl}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 767px) 100vw, 320px"
        priority={false}
      />
      <OverlayIcon
        type="external-link"
        isVisible={false}
        className="group-hover:opacity-100"
      />
    </div>
  );
};
