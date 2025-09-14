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
  ...props
}: ButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 interactive-hover focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-accent-blue text-white hover:bg-accent-blue/80 focus:ring-accent-blue',
    secondary: 'bg-text-secondary text-white hover:bg-text-secondary/90 focus:ring-text-secondary',
    outline: 'border border-accent-blue/20 text-accent-blue hover:text-accent-blue/80 hover:bg-accent-blue/10 focus:ring-accent-blue',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-accent focus:ring-text-secondary'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};