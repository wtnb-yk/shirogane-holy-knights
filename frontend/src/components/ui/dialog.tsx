'use client';

import React from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
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

export const Dialog = ({ open, children }: DialogProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
    <div className="flex items-center justify-between p-6 border-b border-surface-border">
      {children}
    </div>
  );
};

export const DialogTitle = ({ children }: DialogTitleProps) => {
  return (
    <h2 className="text-lg font-semibold text-text-primary">
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
      className="text-text-secondary hover:text-text-secondary transition-colors text-2xl"
    >
      ×
    </button>
  );
};
