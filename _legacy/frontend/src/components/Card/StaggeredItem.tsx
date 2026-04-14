'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useStaggerAnimationStyle } from '@/hooks/useStaggerAnimation';

export interface StaggeredItemProps {
  children: React.ReactNode;
  index: number;
  className?: string;
  animationClass?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

const StaggeredItem = React.forwardRef<
  HTMLDivElement,
  StaggeredItemProps
>(({
  children,
  index,
  className,
  animationClass = 'animate-fade-in',
  as: Component = 'div',
  ...props
}, ref) => {
  const animationStyle = useStaggerAnimationStyle(index);

  // TypeScript issue回避のため、Componentをanyとして扱う
  const DynamicComponent = Component as any;

  return (
    <DynamicComponent
      ref={Component === 'div' ? ref : undefined}
      className={cn('opacity-0', animationClass, className)}
      style={animationStyle}
      {...props}
    >
      {children}
    </DynamicComponent>
  );
});

StaggeredItem.displayName = 'StaggeredItem';

export { StaggeredItem };