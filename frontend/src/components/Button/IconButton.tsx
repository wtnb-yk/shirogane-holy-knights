'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "text-text-secondary hover:text-text-primary hover:bg-surface-hover focus:ring-accent-gold",
        ghost: "text-text-secondary hover:text-text-primary hover:bg-transparent focus:ring-accent-gold",
        danger: "text-text-danger hover:text-text-danger-dark hover:bg-red-50 focus:ring-red-500",
        "primary-gold": "text-text-primary hover:text-accent-gold hover:bg-surface-hover focus:ring-accent-gold",
        "secondary-blue": "text-text-secondary hover:text-accent-blue hover:bg-bg-accent focus:ring-accent-blue"
      },
      size: {
        sm: "min-w-[32px] min-h-[32px] w-8 h-8 p-1",
        md: "min-w-[40px] min-h-[40px] w-10 h-10 p-2",
        lg: "min-w-[44px] min-h-[44px] w-11 h-11 p-2"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>,
    VariantProps<typeof iconButtonVariants> {
  icon: React.ReactNode;
  'aria-label': string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant, size, icon, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={iconButtonVariants({ variant, size })}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
