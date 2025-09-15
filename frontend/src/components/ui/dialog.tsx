'use client';

import React, { useEffect } from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
}

interface DialogContentProps {
  className?: string;
  children: React.ReactNode;
}

interface DialogHeaderProps {
  children: React.ReactNode;
}

interface DialogTitleProps {
  children: React.ReactNode;
}

export const Dialog = ({ 
  open, 
  onOpenChange, 
  children, 
  closeOnOutsideClick = true,
  closeOnEscape = true 
}: DialogProps) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    const handleBodyScroll = () => {
      document.body.style.overflow = 'hidden';
    };

    handleBodyScroll();
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOpenChange, closeOnEscape]);

  if (!open) return null;

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnOutsideClick && event.target === event.currentTarget) {
      onOpenChange(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      {children}
    </div>
  );
};

export const DialogContent = ({ className = '', children }: DialogContentProps) => {
  return (
    <div 
      className={`bg-bg-primary rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto ${className}`}
    >
      {children}
    </div>
  );
};

export const DialogHeader = ({ children }: DialogHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-surface-border mb-4">
      {children}
    </div>
  );
};

export const DialogTitle = ({ children }: DialogTitleProps) => {
  return (
    <h2 className="text-xl font-semibold text-text-primary">
      {children}
    </h2>
  );
};

interface DialogCloseProps {
  onClose: () => void;
}

export const DialogClose = ({ onClose }: DialogCloseProps) => {
  return (
    <button
      onClick={onClose}
      className="text-text-secondary hover:text-text-primary hover:bg-bg-accent/10 transition-all duration-200 text-2xl flex items-center justify-center w-8 h-8 rounded"
    >
      ×
    </button>
  );
};
