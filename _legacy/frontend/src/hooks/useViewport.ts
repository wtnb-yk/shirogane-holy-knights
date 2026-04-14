'use client';

import { useState, useEffect } from 'react';

export const useViewport = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 1024); // lg breakpoint
      setIsLoaded(true);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);

    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  return {
    isDesktop,
    isMobile: !isDesktop,
    isLoaded
  };
};