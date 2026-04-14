'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { FullScreenModalHeader } from './FullScreenModalHeader';
import { FullScreenModalOverlay } from '@/components/Overlay/Overlay';
import { TAILWIND_Z_INDEX } from '@/constants/zIndex';
import { useViewportHeight } from '@/hooks/useViewportHeight';

interface FullScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  title?: ReactNode;
  backButton?: {
    show: boolean;
    onClick: () => void;
  };
}

export const FullScreenModal = ({
  isOpen,
  onClose,
  children,
  className,
  title,
  backButton,
}: FullScreenModalProps) => {
  const { getMaxHeight, isLoaded } = useViewportHeight();

  if (!isOpen) return null;

  const height = isLoaded ? getMaxHeight(64) : 'calc(var(--viewport-height) - 64px)';

  return (
    <>
      <FullScreenModalOverlay
        isOpen={isOpen}
        onClose={onClose}
      />

      <div
        className={cn(
          `fixed bottom-0 left-0 right-0 w-full bg-bg-primary ${TAILWIND_Z_INDEX.CONTENT.MODAL}`,
          'animate-full-screen-in',
          'flex flex-col',
          'overflow-hidden',
          className
        )}
        style={{
          pointerEvents: 'auto',
          height: typeof height === 'number' ? `${height}px` : height
        }}
      >
        <FullScreenModalHeader
          title={title}
          onClose={onClose}
          backButton={backButton}
        />
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="px-4 pb-4">
            <div className="space-y-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
