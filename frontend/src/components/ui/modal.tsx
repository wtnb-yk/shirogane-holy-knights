'use client';

import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export const Modal = ({ 
  isOpen, 
  open, 
  onClose, 
  onOpenChange, 
  children, 
  className = '' 
}: ModalProps) => {
  const isModalOpen = isOpen ?? open ?? false;
  const handleClose = useCallback(() => {
    onClose?.();
    onOpenChange?.(false);
  }, [onClose, onOpenChange]);
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen, handleClose]);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className={`relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto ${className}`}>
        {children}
      </div>
    </div>
  );
};

interface ModalHeaderProps {
  children: React.ReactNode;
  onClose?: () => void;
}

export const ModalHeader = ({ children, onClose }: ModalHeaderProps) => (
  <div className="flex items-center justify-between p-6 border-b">
    <div className="text-lg font-semibold">{children}</div>
    {onClose && (
      <button
        onClick={onClose}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="閉じる"
      >
        <X className="w-5 h-5" />
      </button>
    )}
  </div>
);

interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalContent = ({ children, className = '' }: ModalContentProps) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

// Dialog components for better compatibility
export const Dialog = Modal;

export const DialogContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`bg-white rounded-lg shadow-xl ${className}`}>
      {children}
    </div>
  );
};

export const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-between p-6 pb-4 border-b border-surface-border">
    {children}
  </div>
);

export const DialogBody = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const DialogTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-semibold">{children}</h2>
);

export const DialogClose = ({ onClose }: { onClose?: () => void }) => (
  <button
    onClick={onClose}
    className="p-1 hover:bg-gray-100 rounded-full"
  >
    <X className="w-5 h-5" />
  </button>
);