'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BaseButton, type BaseButtonProps } from './BaseButton';
import { cn } from '@/lib/utils';

export interface NavigationButtonProps extends Omit<BaseButtonProps, 'children'> {
  direction?: 'prev' | 'next';
  iconOnly?: boolean;
  label?: string;
}

export const NavigationButton = React.forwardRef<HTMLButtonElement, NavigationButtonProps>(
  ({ direction = 'next', iconOnly = true, label, className, ...props }, ref) => {
    const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
    const defaultLabel = direction === 'prev' ? '前へ' : '次へ';
    const displayLabel = label || defaultLabel;

    return (
      <BaseButton
        ref={ref}
        variant="ghost"
        size="sm"
        className={cn('gap-1', iconOnly && 'p-2', className)}
        {...props}
      >
        {direction === 'prev' && <Icon className="w-4 h-4" />}
        {!iconOnly && <span className="text-sm">{displayLabel}</span>}
        {direction === 'next' && <Icon className="w-4 h-4" />}
      </BaseButton>
    );
  }
);

NavigationButton.displayName = 'NavigationButton';
