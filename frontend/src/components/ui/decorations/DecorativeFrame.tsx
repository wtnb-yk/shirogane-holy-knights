import React from 'react';

interface DecorativeFrameProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'elegant' | 'royal' | 'simple';
}

export function DecorativeFrame({ children, className = '', variant = 'elegant' }: DecorativeFrameProps) {
  const getFrameVariant = () => {
    switch (variant) {
      case 'royal':
        return (
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" fill="none">
            {/* 角の装飾 */}
            <path
              d="M20 20 L60 20 L60 30 L30 30 L30 60 L20 60 Z"
              fill="currentColor"
              opacity="0.2"
            />
            <path
              d="M380 20 L340 20 L340 30 L370 30 L370 60 L380 60 Z"
              fill="currentColor"
              opacity="0.2"
            />
            <path
              d="M20 180 L60 180 L60 170 L30 170 L30 140 L20 140 Z"
              fill="currentColor"
              opacity="0.2"
            />
            <path
              d="M380 180 L340 180 L340 170 L370 170 L370 140 L380 140 Z"
              fill="currentColor"
              opacity="0.2"
            />
            {/* 装飾ライン */}
            <line x1="60" y1="25" x2="340" y2="25" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <line x1="60" y1="175" x2="340" y2="175" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <line x1="25" y1="60" x2="25" y2="140" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <line x1="375" y1="60" x2="375" y2="140" stroke="currentColor" strokeWidth="2" opacity="0.3" />
          </svg>
        );
      case 'simple':
        return (
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" fill="none">
            <rect
              x="10"
              y="10"
              width="380"
              height="180"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.3"
              rx="8"
            />
          </svg>
        );
      default: // elegant
        return (
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" fill="none">
            {/* 角の装飾パターン */}
            <path
              d="M20 20 Q30 10, 40 20 Q50 30, 40 40 Q30 30, 20 40 Q10 30, 20 20"
              fill="currentColor"
              opacity="0.15"
            />
            <path
              d="M380 20 Q370 10, 360 20 Q350 30, 360 40 Q370 30, 380 40 Q390 30, 380 20"
              fill="currentColor"
              opacity="0.15"
            />
            <path
              d="M20 180 Q30 190, 40 180 Q50 170, 40 160 Q30 170, 20 160 Q10 170, 20 180"
              fill="currentColor"
              opacity="0.15"
            />
            <path
              d="M380 180 Q370 190, 360 180 Q350 170, 360 160 Q370 170, 380 160 Q390 170, 380 180"
              fill="currentColor"
              opacity="0.15"
            />
            {/* 装飾的なライン */}
            <path
              d="M50 25 Q200 15, 350 25"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M50 175 Q200 185, 350 175"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              opacity="0.3"
            />
          </svg>
        );
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="text-noel-primary">
        {getFrameVariant()}
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}