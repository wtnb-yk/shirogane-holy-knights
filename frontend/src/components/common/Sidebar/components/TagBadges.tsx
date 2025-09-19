'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { VideoTagDto, StreamTagDto } from '@/features/archives/types/types';

interface TagBadgesProps {
  tags: VideoTagDto[] | StreamTagDto[] | string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export const TagBadges = ({
  tags,
  selectedTags,
  onTagToggle
}: TagBadgesProps) => {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const tagName = typeof tag === 'string' ? tag : tag.name;
        const tagKey = typeof tag === 'string' ? tag : tag.id.toString();
        return (
          <Badge
            key={tagKey}
            variant={selectedTags.includes(tagName) ? "default" : "outline"}
            className={`cursor-pointer transition-all text-xs px-2.5 py-1.5 ${
              selectedTags.includes(tagName)
                ? 'bg-accent-gold text-white hover:bg-accent-gold/80'
                : 'border-surface-border text-text-secondary hover:border-accent-gold hover:text-accent-gold-dark hover:bg-accent-gold-light/50'
            }`}
            onClick={() => onTagToggle(tagName)}
          >
            {tagName}
          </Badge>
        );
      })}
    </div>
  );
};