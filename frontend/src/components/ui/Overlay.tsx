'use client';

import { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { TAILWIND_Z_INDEX } from '@/constants/zIndex';

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  zIndex?: 'navigation' | 'modal' | 'bottomSheet';
  animate?: boolean;
  closeOnEsc?: boolean;
  closeOnClick?: boolean;
  portal?: boolean;
  className?: string;
}

const Z_INDEX_STYLES = {
  navigation: TAILWIND_Z_INDEX.OVERLAY.NAVIGATION,
  modal: TAILWIND_Z_INDEX.OVERLAY.MODAL,
  bottomSheet: TAILWIND_Z_INDEX.OVERLAY.BOTTOM_SHEET,
} as const;

export function Overlay({
  isOpen,
  onClose,
  zIndex = 'modal',
  animate = false,
  closeOnEsc = true,
  closeOnClick = true,
  portal = false,
  className,
}: OverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // ESCキーでクローズ
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (closeOnEsc && event.key === 'Escape') {
      event.preventDefault();
      onClose();
    }
  }, [closeOnEsc, onClose]);

  // クリックでクローズ
  const handleClick = useCallback((event: React.MouseEvent) => {
    if (closeOnClick && event.target === event.currentTarget) {
      onClose();
    }
  }, [closeOnClick, onClose]);

  // スクロール制御とpointerEvents制御
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPointerEvents = document.body.style.pointerEvents;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.body.style.pointerEvents = 'none';
    document.body.style.touchAction = 'none';

    // タッチイベントの無効化
    const preventTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };

    // パッシブではないリスナーとして登録
    document.addEventListener('touchmove', preventTouchMove, { passive: false });

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.pointerEvents = originalPointerEvents;
      document.body.style.touchAction = originalTouchAction;
      document.removeEventListener('touchmove', preventTouchMove);
    };
  }, [isOpen]);

  // ESCキーイベントリスナー
  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // アニメーション状態管理
  const getAnimationClass = () => {
    if (!animate) return '';
    return isOpen ? 'animate-modal-fade-in' : 'animate-modal-fade-out';
  };

  if (!isOpen) return null;

  const overlayElement = (
    <div
      ref={overlayRef}
      className={cn(
        'fixed inset-0',
        Z_INDEX_STYLES[zIndex],
        'bg-black/20',
        getAnimationClass(),
        className
      )}
      onClick={handleClick}
      aria-hidden="true"
      style={{ pointerEvents: 'auto' }}
    />
  );

  if (portal && typeof document !== 'undefined') {
    return createPortal(overlayElement, document.body);
  }

  return overlayElement;
}

export function NavigationOverlay(props: Omit<OverlayProps, 'zIndex' | 'variant'>) {
  return (
    <Overlay
      {...props}
      zIndex="navigation"
      animate={false}
    />
  );
}

export function ModalOverlay(props: Omit<OverlayProps, 'zIndex' | 'variant'>) {
  return (
    <Overlay
      {...props}
      zIndex="modal"
      animate={true}
    />
  );
}

export function BottomSheetOverlay(props: Omit<OverlayProps, 'zIndex' | 'variant'>) {
  return (
    <Overlay
      {...props}
      zIndex="bottomSheet"
      animate={false}
    />
  );
}
