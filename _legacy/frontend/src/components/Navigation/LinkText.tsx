'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';

interface LinkTextProps {
  href: string;
  children: React.ReactNode;
  showIcon?: boolean;
  className?: string;
  target?: string;
  rel?: string;
}

export const LinkText = ({
  href,
  children,
  showIcon = true,
  className = '',
  target = '_blank',
  rel = 'noopener noreferrer'
}: LinkTextProps) => {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`text-accent-gold hover:underline inline-flex items-center gap-1 transition-colors ${className}`}
    >
      {children}
      {showIcon && <ExternalLink className="w-4 h-4" />}
    </a>
  );
};