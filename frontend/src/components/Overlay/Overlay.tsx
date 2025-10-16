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

  // 背景スクロール制御
  useEffect(() => {
    if (!isOpen) return;

    // 現在のスクロール位置を保存
    const scrollY = window.scrollY;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;
    const originalPointerEvents = document.body.style.pointerEvents;

    // bodyを固定してスクロールを防ぐ
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.pointerEvents = 'none';

    return () => {
      // 元の状態に復元
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      document.body.style.pointerEvents = originalPointerEvents;

      // スクロール位置を復元
      window.scrollTo(0, scrollY);
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
      className="animate-bottom-sheet-overlay-in"
    />
  );
}

export function FullScreenModalOverlay(props: Omit<OverlayProps, 'zIndex' | 'variant'>) {
  return (
    <Overlay
      {...props}
      zIndex="modal"
      animate={true}
    />
  );
}
