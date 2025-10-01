'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-accent-blue text-white hover:bg-accent-blue/80 focus:ring-accent-blue",
        secondary: "bg-text-secondary text-white hover:bg-text-secondary/90 focus:ring-text-secondary",
        outline: "border border-accent-blue/20 text-accent-blue hover:text-accent-blue/80 hover:bg-accent-blue/10 focus:ring-accent-blue",
        ghost: "text-text-secondary hover:text-text-primary hover:bg-bg-accent focus:ring-text-secondary",
        danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
      },
      size: {
        xs: "px-2 py-1 text-xs min-h-[24px]",
        sm: "px-3 py-1.5 text-sm min-h-[32px]",
        md: "px-4 py-2 text-sm min-h-[40px]",
        lg: "px-6 py-3 text-base min-h-[48px]",
        xl: "px-8 py-4 text-lg min-h-[56px]"
      }
    },
    defaultVariants: {
      variant: "secondary",
      size: "md"
    }
  }
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size })}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!loading && leftIcon && <span className="inline-flex">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
