'use client';

import React from 'react';
import { Tag } from 'lucide-react';
import { Badge } from '@/components/Badge/badge';

interface ArchiveCardTagsProps {
  tags?: string[];
  maxVisible: number;
  variant: 'overlay' | 'basic';
}

export const ArchiveCardTags = ({ tags, maxVisible, variant }: ArchiveCardTagsProps) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  if (variant === 'basic') {
    // StreamCardの基本タグ表示（最初のタグのみ、オーバーレイ外）
    return (
      <div className="flex items-center gap-1">
        <span className="bg-white/90 text-gray-900 px-2 py-1 rounded text-xs font-bold">
          {tags[0]}
        </span>
      </div>
    );
  }

  // オーバーレイ内のタグ表示
  return (
    <div className="flex flex-wrap gap-1">
      {tags.slice(0, maxVisible).map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="bg-white/20 text-white hover:bg-white/30 transition-colors text-xs px-2 py-0.5 border-none"
        >
          <Tag className="w-2 h-2 mr-1" />
          {tag}
        </Badge>
      ))}
      {tags.length > maxVisible && (
        <Badge variant="outline" className="text-xs px-2 py-0.5 bg-white/10 text-white border-white/30">
          +{tags.length - maxVisible}
        </Badge>
      )}
    </div>
  );
};