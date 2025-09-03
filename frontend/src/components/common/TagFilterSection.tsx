'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TagFilterSectionProps {
  selectedTags: string[];
  availableTags: string[];
  onTagToggle: (tag: string) => void;
  title?: string;
}

export const TagFilterSection = ({
  selectedTags,
  availableTags,
  onTagToggle,
  title = 'タグ'
}: TagFilterSectionProps) => {
  if (availableTags.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
        <div className="w-1 h-4 bg-accent-gold rounded-full"></div>
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className={`cursor-pointer transition-all duration-200 text-sm px-3 py-2 ${
              selectedTags.includes(tag)
                ? 'bg-accent-gold text-white hover:bg-accent-gold/90'
                : 'border-surface-border text-text-secondary hover:border-accent-gold hover:text-text-primary hover:bg-accent-gold/10'
            }`}
            onClick={() => onTagToggle(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};