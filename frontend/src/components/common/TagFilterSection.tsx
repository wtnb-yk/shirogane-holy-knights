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
      <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <div className="w-1 h-4 bg-accent-gold rounded-full"></div>
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag, index) => {
          return (
            <Badge
              key={index}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 text-sm px-3 py-2 ${
                selectedTags.includes(tag)
                  ? 'bg-accent-gold/90 text-white border-0 hover:bg-accent-gold-hover'
                  : 'bg-white/90 text-surface-primary border border-white/20 hover:bg-gray-100'
              }`}
              onClick={() => onTagToggle(tag)}
            >
              {tag}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};
