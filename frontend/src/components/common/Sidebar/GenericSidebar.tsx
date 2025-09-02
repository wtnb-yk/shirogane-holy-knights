'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type SidebarWidth = 'sm' | 'md' | 'lg';

interface GenericSidebarProps {
  children: React.ReactNode;
  width?: SidebarWidth | string;
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const widthClasses: Record<SidebarWidth, string> = {
  sm: 'w-48 md:w-56 lg:w-64',    // 192px → 224px → 256px
  md: 'w-56 md:w-64 lg:w-72',    // 224px → 256px → 288px  
  lg: 'w-64 md:w-72 lg:w-80'     // 256px → 288px → 320px
};

export const GenericSidebar = ({
  children,
  width = 'md',
  responsive = true,
  className,
  style
}: GenericSidebarProps) => {
  const getWidthClasses = () => {
    if (typeof width === 'string' && width in widthClasses) {
      return widthClasses[width as SidebarWidth];
    }
    if (typeof width === 'string' && !width.includes('w-')) {
      return `w-[${width}]`;
    }
    return width;
  };

  const responsiveClasses = responsive 
    ? 'hidden md:block' 
    : '';

  return (
    <aside 
      className={cn(
        'flex-shrink-0 bg-gray-50 rounded-xl p-6 h-fit',
        getWidthClasses(),
        responsiveClasses,
        className
      )}
      style={style}
    >
      {children}
    </aside>
  );
};