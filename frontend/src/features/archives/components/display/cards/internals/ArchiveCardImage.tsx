'use client';

import React from 'react';
import Image from 'next/image';
import { IMAGE_STYLES } from '@/constants/styles';

interface ArchiveCardImageProps {
  thumbnailUrl?: string | null;
  title: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes: string;
  showPlaceholder?: boolean;
}

export const ArchiveCardImage = ({
  thumbnailUrl,
  title,
  loading = 'lazy',
  priority = false,
  sizes,
  showPlaceholder = false
}: ArchiveCardImageProps) => {
  if (thumbnailUrl) {
    return (
      <div className="relative w-full aspect-video overflow-hidden bg-black">
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading={loading}
          priority={priority}
          sizes={sizes}
          placeholder="blur"
          blurDataURL={IMAGE_STYLES.placeholder}
        />
      </div>
    );
  }

  if (showPlaceholder) {
    return (
      <div className="relative w-full aspect-video overflow-hidden bg-gradient-to-br from-purple-500 via-blue-500 to-teal-400 flex items-center justify-center">
        <div className="text-white text-sm font-medium text-center px-4">
          サムネイル画像
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video overflow-hidden bg-bg-accent" />
  );
};