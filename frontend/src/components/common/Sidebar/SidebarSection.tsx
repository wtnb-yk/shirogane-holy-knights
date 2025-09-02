'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SidebarSectionProps {
  children: React.ReactNode;
  className?: string;
  noBorder?: boolean;
}

export const SidebarSection = ({
  children,
  className,
  noBorder = false
}: SidebarSectionProps) => {
  return (
    <div 
      className={cn(
        !noBorder && 'pb-6 mb-6 border-b border-gray-200',
        noBorder && 'last:mb-0',
        className
      )}
    >
      {children}
    </div>
  );
};