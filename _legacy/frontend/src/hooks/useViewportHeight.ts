'use client';

import { useState, useEffect } from 'react';

export const useViewportHeight = () => {
  const [viewportHeight, setViewportHeight] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const updateViewportHeight = () => {
      const height = window.innerHeight;
      setViewportHeight(height);
      setIsLoaded(true);

      // CSS変数として設定し、他のコンポーネントでも利用可能にする
      document.documentElement.style.setProperty('--viewport-height', `${height}px`);
    };

    // 初期設定
    updateViewportHeight();

    // リサイズイベント監視
    window.addEventListener('resize', updateViewportHeight);

    // iOS Safariでのビューポート変更を検知
    // orientationchangeとvisualViewport変更を監視
    window.addEventListener('orientationchange', updateViewportHeight);

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewportHeight);
    }

    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);

      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateViewportHeight);
      }
    };
  }, []);

  return {
    viewportHeight,
    isLoaded,
    // 便利なヘルパー関数
    getMaxHeight: (offset: number = 0) => Math.max(0, viewportHeight - offset)
  };
};