'use client';

import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalHeaderProps {
  title: ReactNode;
  onClose: () => void;
}

export const ModalHeader = ({
  title,
  onClose,
}: ModalHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
      <h2 className="text-lg font-bold text-text-primary">
        {title}
      </h2>
      <button
        onClick={onClose}
        className="p-2 text-text-primary hover:text-accent-gold transition-colors rounded-lg hover:bg-surface-hover"
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
};
