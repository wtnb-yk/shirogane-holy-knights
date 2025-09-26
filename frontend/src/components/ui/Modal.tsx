'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { ModalOverlay } from './Overlay';

interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const Modal = ({
  open,
  onOpenChange,
  children
}: ModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const handleClose = useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      // 次のフレームでアニメーション開始
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
      // アニメーション完了後にコンポーネントをアンマウント
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // ESCキーハンドリングとスクロール制御は ModalOverlay で処理

  if (!shouldRender) return null;

  return (
    <>
      <ModalOverlay
        isOpen={!!open}
        onClose={handleClose}
        animate={true}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 pointer-events-none">
        <div
          className={`relative w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto max-h-[85vh] sm:max-h-[90vh] overflow-y-auto pointer-events-auto ${
            isVisible ? 'animate-modal-slide-scale' : 'animate-modal-slide-scale-out'
          }`}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)'
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
};

interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalContent = ({
  children,
  className = ''
}: ModalContentProps) => {
  return (
    <div className={`p-4 sm:p-6 ${className}`}>
      {children}
    </div>
  );
};
