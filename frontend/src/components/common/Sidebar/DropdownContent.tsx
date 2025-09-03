'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface DropdownContentProps {
  children: React.ReactNode;
  className?: string;
}

export const DropdownContent = ({
  children,
  className
}: DropdownContentProps) => {
  return (
    <div className={cn('space-y-6', className)}>
      {children}
    </div>
  );
};