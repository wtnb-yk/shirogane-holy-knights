'use client';

import React from 'react';

interface ModalButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const ModalButton = ({
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false
}: ModalButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-8 py-2 bg-accent-gold text-white border border-accent-gold rounded-md hover:bg-accent-gold-dark hover:border-accent-gold-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};
