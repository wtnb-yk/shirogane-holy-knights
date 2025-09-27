'use client';

import React, { useEffect, useCallback, useState, ReactNode } from 'react';
import { ModalOverlay } from './Overlay';
import { ModalHeader } from './ModalHeader';

interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  title: ReactNode;
}

export const Modal = ({
  open,
  onOpenChange,
  children,
  title
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
      return;
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
          className={`relative w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto max-h-[85vh] sm:max-h-[90vh] overflow-y-auto pointer-events-auto bg-bg-primary ${
            isVisible ? 'animate-modal-slide-scale' : 'animate-modal-slide-scale-out'
          }`}
          style={{
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
        >
          <ModalHeader title={title} onClose={handleClose} />
          <div className="px-4 pb-4 sm:px-6 sm:pb-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

