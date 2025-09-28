'use client';

import React from 'react';
import { Card } from '@/components/Card/card';
import { cn } from '@/lib/utils';

export interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  hoverScale?: 'sm' | 'md';
  disabled?: boolean;
  'aria-label'?: string;
  target?: string;
  rel?: string;
}

const InteractiveCard = React.forwardRef<
  HTMLDivElement,
  InteractiveCardProps
>(({
  children,
  className,
  href,
  onClick,
  hoverScale = 'sm',
  disabled = false,
  'aria-label': ariaLabel,
  target,
  rel,
  ...props
}, ref) => {
  const baseClasses = cn(
    'h-full overflow-hidden bg-bg-primary border border-surface-border',
    hoverScale === 'sm' ? 'card-hover-scale' : 'card-hover-scale-md',
    disabled && 'opacity-50 cursor-not-allowed',
    !disabled && (href || onClick) && 'cursor-pointer',
    className
  );

  const cardContent = (
    <Card 
      ref={ref}
      className={baseClasses}
      {...props}
    >
      {children}
    </Card>
  );

  if (href && !disabled) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        className="block h-full group"
      >
        {cardContent}
      </a>
    );
  }

  if (onClick && !disabled) {
    return (
      <div
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        className="block h-full group"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {cardContent}
      </div>
    );
  }

  return cardContent;
});

InteractiveCard.displayName = 'InteractiveCard';

export { InteractiveCard };