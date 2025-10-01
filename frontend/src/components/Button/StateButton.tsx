'use client';

import React from 'react';
import { type LucideIcon } from 'lucide-react';
import { BaseButton, type BaseButtonProps } from './BaseButton';
import { cn } from '@/lib/utils';

export interface StateButtonProps extends Omit<BaseButtonProps, 'children'> {
  icon?: LucideIcon;
  label: string;
  isActive?: boolean;
  count?: number;
  showActiveDot?: boolean;
}

export const StateButton = React.forwardRef<HTMLButtonElement, StateButtonProps>(
  (
    { icon: Icon, label, isActive = false, count = 0, showActiveDot = false, className, ...props },
    ref
  ) => {
    return (
      <BaseButton
        ref={ref}
        variant="outline"
        size="md"
        className={cn(
          'relative gap-2 border transition-all',
          isActive
            ? 'bg-accent-gold-light border-accent-gold/50 text-text-primary'
            : 'bg-bg-primary text-text-secondary border-surface-border hover:bg-bg-accent hover:text-text-primary',
          className
        )}
        {...props}
      >
        {Icon && <Icon className="w-5 h-5" />}
        <span className="text-sm font-medium">{label}</span>

        {isActive && count > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-accent-gold text-white text-xs font-semibold rounded-full flex items-center justify-center shadow-sm">
            {count > 99 ? '99+' : count}
          </span>
        )}

        {isActive && showActiveDot && !count && (
          <span className="ml-1 w-2 h-2 bg-text-secondary rounded-full"></span>
        )}
      </BaseButton>
    );
  }
);

StateButton.displayName = 'StateButton';
