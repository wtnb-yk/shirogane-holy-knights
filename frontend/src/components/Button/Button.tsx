'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = ({
  variant = 'secondary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 interactive-hover focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

  const variantClasses = {
    primary: 'bg-accent-blue text-white hover:bg-accent-blue/80 focus:ring-accent-blue disabled:hover:bg-accent-blue',
    secondary: 'bg-text-secondary text-white hover:bg-text-secondary/90 focus:ring-text-secondary disabled:hover:bg-text-secondary',
    outline: 'border border-accent-blue/20 text-accent-blue hover:text-accent-blue/80 hover:bg-accent-blue/10 focus:ring-accent-blue disabled:hover:text-accent-blue disabled:hover:bg-transparent',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-accent focus:ring-text-secondary disabled:hover:text-text-secondary disabled:hover:bg-transparent'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm min-h-[32px]',
    md: 'px-4 py-2 text-sm min-h-[40px]',
    lg: 'px-6 py-3 text-base min-h-[48px]'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};