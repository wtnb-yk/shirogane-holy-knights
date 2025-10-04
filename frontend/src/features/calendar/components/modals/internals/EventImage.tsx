import React from 'react';
import Image from 'next/image';
import { Event } from '../../../types';
import { getImageUrl } from '@/utils/imageUrl';
import { IMAGE_STYLES } from '@/constants/styles';

interface EventImageProps {
  event: Event;
}

export function EventImage({ event }: EventImageProps) {
  if (!event.imageUrl || !getImageUrl(event.imageUrl)) {
    return null;
  }

  return (
    <div>
      <div className="relative w-full aspect-video overflow-hidden rounded-lg">
        <Image
          src={getImageUrl(event.imageUrl)!}
          alt={event.title}
          fill
          className="object-cover"
          loading="lazy"
          placeholder="blur"
          blurDataURL={IMAGE_STYLES.placeholder}
        />
      </div>
    </div>
  );
}