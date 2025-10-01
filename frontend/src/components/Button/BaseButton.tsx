'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-accent-blue text-white hover:bg-accent-blue/80 focus:ring-accent-blue disabled:hover:bg-accent-blue',
        secondary: 'bg-text-secondary text-white hover:bg-text-secondary/90 focus:ring-text-secondary disabled:hover:bg-text-secondary',
        outline: 'border border-accent-blue/20 text-accent-blue hover:text-accent-blue/80 hover:bg-accent-blue/10 focus:ring-accent-blue disabled:hover:text-accent-blue disabled:hover:bg-transparent',
        ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-accent focus:ring-text-secondary disabled:hover:text-text-secondary disabled:hover:bg-transparent',
        gold: 'bg-accent-gold text-white hover:bg-accent-gold-dark focus:ring-accent-gold border border-accent-gold disabled:hover:bg-accent-gold',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm min-h-[32px]',
        md: 'px-4 py-2 text-sm min-h-[40px]',
        lg: 'px-6 py-3 text-base min-h-[48px]',
      },
      interactive: {
        true: 'interactive-hover',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'md',
      interactive: true,
    },
  }
);

export interface BaseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const BaseButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  ({ className, variant, size, interactive, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, interactive, className }))}
        ref={ref}
        disabled={disabled}
        aria-disabled={disabled}
        {...props}
      />
    );
  }
);

BaseButton.displayName = 'BaseButton';

export { buttonVariants };
