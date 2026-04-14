'use client';

import React, { useEffect, useCallback, useState, ReactNode } from 'react';
import { ModalOverlay } from '@/components/Overlay/Overlay';
import { ModalHeader } from './ModalHeader';
import { TAILWIND_Z_INDEX } from '@/constants/zIndex';

interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  title: ReactNode;
  backButton?: {
    show: boolean;
    onClick: () => void;
  };
}

export const Modal = ({
  open,
  onOpenChange,
  children,
  title,
  backButton
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
      <div className={`fixed inset-0 ${TAILWIND_Z_INDEX.CONTENT.MODAL} flex items-center justify-center p-4 sm:p-6 lg:p-8 pointer-events-none`}>
        <div
          className={`relative w-full max-w-3xl mx-auto max-h-[85vh] sm:max-h-[90vh] flex flex-col overflow-hidden pointer-events-auto bg-bg-primary ${
            isVisible ? 'animate-modal-slide-scale' : 'animate-modal-slide-scale-out'
          }`}
          style={{
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
        >
          <div className="flex-shrink-0">
            <ModalHeader title={title} onClose={handleClose} backButton={backButton} />
          </div>
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="px-4 pb-4 sm:px-6 sm:pb-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

