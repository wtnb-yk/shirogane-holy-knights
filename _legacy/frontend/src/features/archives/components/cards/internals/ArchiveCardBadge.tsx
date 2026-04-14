'use client';

import React from 'react';
import { PlayCircle, Star } from 'lucide-react';
import { Badge } from '@/components/Badge/badge';

interface ArchiveCardBadgeProps {
  variant?: 'default' | 'featured' | 'pickup';
}

export const ArchiveCardBadge = ({ variant }: ArchiveCardBadgeProps) => {
  if (!variant || variant === 'default') {
    return null;
  }

  return (
    <div className="absolute top-4 left-4 z-10">
      {variant === 'featured' && (
        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-none px-3 py-1 text-sm font-bold shadow-lg">
          <PlayCircle className="w-4 h-4 mr-2" />
          LATEST
        </Badge>
      )}
      {variant === 'pickup' && (
        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-none px-3 py-1 text-sm font-bold shadow-lg">
          <Star className="w-4 h-4 mr-2" />
          PICKUP
        </Badge>
      )}
    </div>
  );
};