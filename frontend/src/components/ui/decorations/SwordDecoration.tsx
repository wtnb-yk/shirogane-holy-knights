import React from 'react';

interface SwordDecorationProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'classic' | 'ornate' | 'ceremonial';
  className?: string;
  animate?: boolean;
}

export function SwordDecoration({ 
  size = 'md', 
  variant = 'classic', 
  className = '', 
  animate = false 
}: SwordDecorationProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-4 h-16';
      case 'md': return 'w-6 h-24';
      case 'lg': return 'w-8 h-32';
      case 'xl': return 'w-12 h-48';
      default: return 'w-6 h-24';
    }
  };

  const getSvgContent = () => {
    switch (variant) {
      case 'ornate':
        return (
          <>
            {/* 装飾的な剣 */}
            <defs>
              <linearGradient id={`swordGradient-${variant}-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#C0C0C0', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#E5E5E5', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#A0A0A0', stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id={`handleGradient-${variant}-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#8B4513', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#654321', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            
            {/* 剣身 */}
            <path
              d="M50 5 L55 15 L52 80 L48 80 L45 15 Z"
              fill={`url(#swordGradient-${variant}-${size})`}
              stroke="#999"
              strokeWidth="0.5"
            />
            
            {/* 装飾刻印 */}
            <path
              d="M50 20 L52 25 L50 30 L48 25 Z"
              fill="#FFD700"
              opacity="0.8"
            />
            <path
              d="M50 35 L52 40 L50 45 L48 40 Z"
              fill="#FFD700"
              opacity="0.8"
            />
            
            {/* ガード */}
            <rect x="35" y="78" width="30" height="4" fill={`url(#handleGradient-${variant}-${size})`} />
            
            {/* 柄 */}
            <rect x="47" y="82" width="6" height="12" fill={`url(#handleGradient-${variant}-${size})`} />
            
            {/* ポンメル */}
            <circle cx="50" cy="96" r="3" fill="#FFD700" />
          </>
        );
      
      case 'ceremonial':
        return (
          <>
            {/* 儀式用の剣 */}
            <defs>
              <linearGradient id={`ceremonialGradient-${variant}-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#F0F0F0', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#D0D0D0', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            
            {/* 剣身 */}
            <path
              d="M50 5 L53 12 L52 75 L48 75 L47 12 Z"
              fill={`url(#ceremonialGradient-${variant}-${size})`}
              stroke="#AAA"
              strokeWidth="0.5"
            />
            
            {/* 中央の溝 */}
            <line x1="50" y1="10" x2="50" y2="70" stroke="#CCC" strokeWidth="1" />
            
            {/* 宝石装飾 */}
            <circle cx="50" cy="25" r="2" fill="#FF69B4" opacity="0.9" />
            <circle cx="50" cy="40" r="2" fill="#87CEEB" opacity="0.9" />
            <circle cx="50" cy="55" r="2" fill="#FFD700" opacity="0.9" />
            
            {/* 装飾的なガード */}
            <path
              d="M30 75 Q40 73 50 75 Q60 73 70 75 Q60 77 50 75 Q40 77 30 75"
              fill="#FFD700"
              stroke="#FFA500"
              strokeWidth="0.5"
            />
            
            {/* 柄 */}
            <rect x="47" y="78" width="6" height="15" fill="#8B4513" />
            <rect x="46" y="80" width="8" height="2" fill="#FFD700" />
            <rect x="46" y="85" width="8" height="2" fill="#FFD700" />
            <rect x="46" y="90" width="8" height="2" fill="#FFD700" />
            
            {/* 装飾的なポンメル */}
            <circle cx="50" cy="95" r="4" fill="#FFD700" />
            <circle cx="50" cy="95" r="2" fill="#FF69B4" />
          </>
        );
      
      default: // classic
        return (
          <>
            <defs>
              <linearGradient id={`classicGradient-${variant}-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#E0E0E0', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#B0B0B0', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            
            {/* 剣身 */}
            <path
              d="M50 5 L54 15 L52 78 L48 78 L46 15 Z"
              fill={`url(#classicGradient-${variant}-${size})`}
              stroke="#888"
              strokeWidth="0.5"
            />
            
            {/* ガード */}
            <rect x="38" y="76" width="24" height="3" fill="#666" />
            
            {/* 柄 */}
            <rect x="47" y="79" width="6" height="15" fill="#8B4513" />
            
            {/* ポンメル */}
            <circle cx="50" cy="95" r="2.5" fill="#666" />
          </>
        );
    }
  };

  return (
    <div className={`${getSizeClasses()} ${animate ? 'animate-sword-glow' : ''} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md"
      >
        {getSvgContent()}
      </svg>
    </div>
  );
}