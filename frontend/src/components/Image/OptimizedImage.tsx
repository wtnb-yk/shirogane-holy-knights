'use client';

import React, { useState, useCallback } from 'react';
import Image, { StaticImageData } from 'next/image';
import { useInView } from 'react-intersection-observer';
import { IMAGE_STYLES } from '@/constants/styles';

interface OptimizedImageProps {
  src: string | StaticImageData;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

// StaticImageDataかどうかを判定するヘルパー関数
function isStaticImageData(src: string | StaticImageData): src is StaticImageData {
  return typeof src === 'object' && src !== null && 'src' in src;
}

export const OptimizedImage = React.memo<OptimizedImageProps>(({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  quality = 85,
  placeholder = 'blur',
  blurDataURL = IMAGE_STYLES.placeholder,
  onLoad,
  onError,
}) => {
  // StaticImageDataの場合は、Next.jsの最適化情報を使用
  const imageData = isStaticImageData(src) ? src : null;
  const imageSrc = imageData ? imageData.src : src as string;
  const imageWidth = imageData?.width || width;
  const imageHeight = imageData?.height || height;
  const imageBlurDataURL = imageData?.blurDataURL || blurDataURL;

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Intersection Observer for lazy loading
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    skip: priority, // Skip intersection observer if priority is true
  });

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  // Don't render image until it's in view (unless priority)
  const shouldLoad = priority || inView;

  if (hasError) {
    return (
      <div 
        ref={ref}
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={fill ? undefined : { width: imageWidth, height: imageHeight }}
      >
        <span className="text-text-tertiary text-sm">画像を読み込めませんでした</span>
      </div>
    );
  }

  if (shouldLoad) {
    return (
      <Image
        ref={ref}
        src={imageSrc}
        alt={alt}
        width={fill ? undefined : imageWidth}
        height={fill ? undefined : imageHeight}
        fill={fill}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        sizes={sizes}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={imageBlurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
      />
    );
  }

  // Placeholder while not in view
  return (
    <div
      ref={ref}
      className={`bg-gray-200 animate-pulse ${className}`}
      style={fill ? undefined : { width: imageWidth, height: imageHeight }}
    />
  );
});

OptimizedImage.displayName = 'OptimizedImage';