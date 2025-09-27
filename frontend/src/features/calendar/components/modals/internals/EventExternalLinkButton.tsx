import React from 'react';
import { ExternalLink } from 'lucide-react';

interface EventExternalLinkButtonProps {
  url: string;
}

export const EventExternalLinkButton: React.FC<EventExternalLinkButtonProps> = ({ url }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg
                 bg-transparent text-text-secondary transition-all duration-200
                 hover:bg-surface-hover hover:text-accent-gold
                 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-offset-2 focus:ring-offset-surface-primary"
      aria-label="外部リンクを開く"
      title="外部リンクを開く"
    >
      <ExternalLink size={20} />
    </button>
  );
};