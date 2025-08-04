import React from 'react';

interface KnightEmblemProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'shield' | 'crest' | 'simple';
  animate?: boolean;
}

export function KnightEmblem({ 
  size = 'md', 
  className = '', 
  variant = 'shield',
  animate = false 
}: KnightEmblemProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const getEmblemVariant = () => {
    switch (variant) {
      case 'crest':
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            {/* 紋章ベース */}
            <path
              d="M50 10 L70 25 L70 45 L60 55 L50 85 L40 55 L30 45 L30 25 Z"
              fill="currentColor"
              opacity="0.1"
              stroke="currentColor"
              strokeWidth="2"
            />
            {/* 十字 */}
            <path
              d="M45 25 L55 25 L55 35 L65 35 L65 45 L55 45 L55 55 L45 55 L45 45 L35 45 L35 35 L45 35 Z"
              fill="currentColor"
              opacity="0.8"
            />
            {/* 王冠 */}
            <path
              d="M40 20 L45 15 L50 18 L55 15 L60 20 L55 25 L45 25 Z"
              fill="currentColor"
              opacity="0.6"
            />
          </svg>
        );
      case 'simple':
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            {/* シンプルな盾 */}
            <path
              d="M50 15 L75 25 L75 50 L50 85 L25 50 L25 25 Z"
              fill="currentColor"
              opacity="0.2"
              stroke="currentColor"
              strokeWidth="2"
            />
            {/* 中央の剣 */}
            <path
              d="M48 25 L52 25 L52 65 L55 65 L55 70 L45 70 L45 65 L48 65 Z"
              fill="currentColor"
              opacity="0.8"
            />
            <path
              d="M45 25 L55 25 L55 30 L45 30 Z"
              fill="currentColor"
              opacity="0.8"
            />
          </svg>
        );
      default: // shield
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            {/* 盾の外形 */}
            <path
              d="M50 12 L78 22 L78 48 L50 88 L22 48 L22 22 Z"
              fill="currentColor"
              opacity="0.1"
              stroke="currentColor"
              strokeWidth="2"
            />
            {/* 内側の装飾 */}
            <path
              d="M50 20 L70 28 L70 45 L50 75 L30 45 L30 28 Z"
              fill="currentColor"
              opacity="0.15"
            />
            {/* ライオンのシルエット */}
            <ellipse cx="50" cy="35" rx="8" ry="6" fill="currentColor" opacity="0.6" />
            <ellipse cx="45" cy="32" rx="2" ry="2" fill="currentColor" opacity="0.8" />
            <ellipse cx="55" cy="32" rx="2" ry="2" fill="currentColor" opacity="0.8" />
            {/* 鬣 */}
            <path
              d="M42 28 Q38 25, 42 22 Q46 25, 42 28"
              fill="currentColor"
              opacity="0.5"
            />
            <path
              d="M58 28 Q62 25, 58 22 Q54 25, 58 28"
              fill="currentColor"
              opacity="0.5"
            />
            {/* 体 */}
            <ellipse cx="50" cy="50" rx="12" ry="18" fill="currentColor" opacity="0.4" />
          </svg>
        );
    }
  };

  return (
    <div className={`${sizeClasses[size]} text-noel-primary ${animate ? 'animate-pulse' : ''} ${className}`}>
      {getEmblemVariant()}
    </div>
  );
}