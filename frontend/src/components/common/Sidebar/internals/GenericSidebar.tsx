'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GenericSidebarProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}


export const GenericSidebar = ({
  children,
  className,
  style
}: GenericSidebarProps) => {
  return (
    <aside
      className={cn(
        'flex-shrink-0 bg-bg-tertiary rounded-xl p-6 sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto w-64 md:w-72 lg:w-80',
        className
      )}
      style={style}
    >
      {children}
    </aside>
  );
};