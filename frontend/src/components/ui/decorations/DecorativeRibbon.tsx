import React from 'react';

interface DecorativeRibbonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'banner' | 'scroll' | 'simple';
  position?: 'top' | 'bottom' | 'middle';
}

export function DecorativeRibbon({ 
  children, 
  className = '', 
  variant = 'banner',
  position = 'middle'
}: DecorativeRibbonProps) {
  const positionClasses = {
    top: 'items-start',
    bottom: 'items-end',
    middle: 'items-center'
  };

  const getRibbonVariant = () => {
    switch (variant) {
      case 'scroll':
        return (
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 80" fill="none">
            {/* スクロール形状 */}
            <path
              d="M20 15 Q15 10, 10 15 L10 65 Q15 70, 20 65 L280 65 Q285 70, 290 65 L290 15 Q285 10, 280 15 Z"
              fill="currentColor"
              opacity="0.1"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {/* 左端の巻き */}
            <circle cx="20" cy="40" r="8" fill="currentColor" opacity="0.2" />
            <circle cx="280" cy="40" r="8" fill="currentColor" opacity="0.2" />
            {/* 装飾ライン */}
            <line x1="35" y1="25" x2="265" y2="25" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <line x1="35" y1="55" x2="265" y2="55" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          </svg>
        );
      case 'simple':
        return (
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 60" fill="none">
            <rect
              x="10"
              y="15"
              width="280"
              height="30"
              rx="15"
              fill="currentColor"
              opacity="0.1"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        );
      default: // banner
        return (
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 80" fill="none">
            {/* リボンの本体 */}
            <path
              d="M30 20 L270 20 L280 30 L270 60 L30 60 L20 30 Z"
              fill="currentColor"
              opacity="0.1"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {/* 左右の尻尾 */}
            <path
              d="M20 30 L5 25 L10 40 L5 55 L20 50"
              fill="currentColor"
              opacity="0.15"
            />
            <path
              d="M280 30 L295 25 L290 40 L295 55 L280 50"
              fill="currentColor"
              opacity="0.15"
            />
            {/* 装飾的な縫い目 */}
            <line x1="35" y1="30" x2="265" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.3" strokeDasharray="3,3" />
            <line x1="35" y1="50" x2="265" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.3" strokeDasharray="3,3" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative flex ${positionClasses[position]} justify-center px-8 py-4 ${className}`}>
      <div className="text-noel-primary">
        {getRibbonVariant()}
      </div>
      <div className="relative z-10 text-center">
        {children}
      </div>
    </div>
  );
}