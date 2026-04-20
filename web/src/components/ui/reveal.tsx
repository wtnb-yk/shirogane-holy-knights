'use client';

import { type ReactNode } from 'react';
import { useReveal } from '@/hooks/use-reveal';

export function Reveal({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const { ref, isVisible } = useReveal();

  return (
    <div
      ref={ref}
      className={`reveal${isVisible ? ' visible' : ''} ${className}`.trim()}
    >
      {children}
    </div>
  );
}

export function RevealStagger({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const { ref, isVisible } = useReveal();

  return (
    <div
      ref={ref}
      className={`reveal-stagger${isVisible ? ' visible' : ''} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
