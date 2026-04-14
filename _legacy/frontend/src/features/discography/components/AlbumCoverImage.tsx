'use client';

import React from 'react';
import { OptimizedImage } from '@/components/Image/OptimizedImage';
import { Music } from 'lucide-react';
import { getImageUrl } from '@/utils/imageUrl';

interface AlbumCoverImageProps {
  coverImageUrl?: string | null;
  title: string;
  className?: string;
}

export const AlbumCoverImage = ({
  coverImageUrl,
  title,
  className = ''
}: AlbumCoverImageProps) => {
  const imageUrl = getImageUrl(coverImageUrl);

  return (
    <div className={`w-40 h-40 sm:w-48 sm:h-48 relative rounded-lg overflow-hidden bg-bg-secondary ${className}`}>
      {imageUrl ? (
        <OptimizedImage
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 160px, 192px"
          priority={false}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Music className="w-16 h-16 text-text-muted" />
        </div>
      )}
    </div>
  );
};