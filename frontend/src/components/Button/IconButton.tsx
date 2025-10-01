'use client';

import React from 'react';
import { type LucideIcon } from 'lucide-react';
import { BaseButton, type BaseButtonProps } from './BaseButton';
import { cn } from '@/lib/utils';

export interface IconButtonProps extends Omit<BaseButtonProps, 'children'> {
  icon: LucideIcon;
  label?: string;
  iconClassName?: string;
  iconPosition?: 'left' | 'right';
  iconOnly?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon: Icon,
      label,
      iconClassName,
      iconPosition = 'left',
      iconOnly = false,
      className,
      variant = 'ghost',
      ...props
    },
    ref
  ) => {
    const iconElement = <Icon className={cn('w-5 h-5', iconClassName)} />;

    const defaultStyles = 'text-text-primary hover:text-accent-gold transition-colors rounded-lg hover:bg-surface-hover flex items-center justify-center';

    return (
      <BaseButton
        ref={ref}
        variant={variant}
        className={cn(iconOnly && 'p-3 min-h-[44px] min-w-[44px]', defaultStyles, className)}
        {...props}
      >
        {iconOnly ? (
          iconElement
        ) : (
          <>
            {iconPosition === 'left' && iconElement}
            {label && <span className={cn(iconPosition === 'left' ? 'ml-2' : 'mr-2')}>{label}</span>}
            {iconPosition === 'right' && iconElement}
          </>
        )}
      </BaseButton>
    );
  }
);

IconButton.displayName = 'IconButton';
