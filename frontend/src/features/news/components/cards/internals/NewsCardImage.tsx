'use client';

import React from 'react';
import Image from 'next/image';
import { OverlayIcon } from '@/components/Overlay/OverlayIcon';
import { IMAGE_STYLES } from '@/constants/styles';

interface NewsCardImageProps {
  imageUrl: string;
  alt: string;
}

export const NewsCardImage = ({ imageUrl, alt }: NewsCardImageProps) => {
  return (
    <div className="relative w-full md:w-80 h-48 md:h-[200px] flex-shrink-0 overflow-hidden bg-bg-accent">
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        sizes="(max-width: 767px) 100vw, 320px"
        placeholder="blur"
        blurDataURL={IMAGE_STYLES.placeholder}
      />
      <OverlayIcon
        type="external-link"
        isVisible={false}
        className="group-hover:opacity-100"
      />
    </div>
  );
};