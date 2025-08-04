import React from 'react';

interface CowBellDecorationProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'single' | 'chain' | 'cluster';
  className?: string;
  animate?: boolean;
}

export function CowBellDecoration({ 
  size = 'md', 
  variant = 'single', 
  className = '', 
  animate = false 
}: CowBellDecorationProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-6 h-8';
      case 'md': return 'w-8 h-10';
      case 'lg': return 'w-12 h-15';
      case 'xl': return 'w-16 h-20';
      default: return 'w-8 h-10';
    }
  };

  const getSingleBell = (x: number, y: number, scale: number = 1, rotate: number = 0) => (
    <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotate}, 50, 50)`}>
      <defs>
        <linearGradient id={`bellGradient-${x}-${y}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#FFA500', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#FF8C00', stopOpacity: 1 }} />
        </linearGradient>
        <radialGradient id={`bellShine-${x}-${y}`} cx="30%" cy="30%">
          <stop offset="0%" style={{ stopColor: '#FFFFFF', stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: '#FFFFFF', stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      
      {/* ベル本体 */}
      <path
        d="M35 30 Q35 25 50 25 Q65 25 65 30 L68 60 Q68 70 50 75 Q32 70 32 60 Z"
        fill={`url(#bellGradient-${x}-${y})`}
        stroke="#DAA520"
        strokeWidth="1"
      />
      
      {/* ベルの光沢 */}
      <ellipse
        cx="45"
        cy="40"
        rx="8"
        ry="12"
        fill={`url(#bellShine-${x}-${y})`}
      />
      
      {/* ベルの口 */}
      <ellipse cx="50" cy="75" rx="18" ry="3" fill="#B8860B" />
      
      {/* 吊り下げリング */}
      <circle cx="50" cy="20" r="4" fill="none" stroke="#DAA520" strokeWidth="2" />
      <circle cx="50" cy="20" r="2" fill="#FFD700" />
      
      {/* ベルの中央線 */}
      <line x1="50" y1="30" x2="50" y2="70" stroke="#B8860B" strokeWidth="1" opacity="0.6" />
      
      {/* 装飾的なリム */}
      <path
        d="M35 30 Q50 28 65 30"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        opacity="0.8"
      />
      
      {/* 内部のクラッパー（舌） */}
      <circle cx="50" cy="65" r="3" fill="#8B4513" />
      <line x1="50" y1="62" x2="50" y2="68" stroke="#654321" strokeWidth="1" />
    </g>
  );

  const getSvgContent = () => {
    switch (variant) {
      case 'chain':
        return (
          <>
            {/* 鈴の連なり */}
            {getSingleBell(20, 10, 0.7, -10)}
            {getSingleBell(50, 25, 0.8, 0)}
            {getSingleBell(80, 40, 0.7, 10)}
            
            {/* 連結チェーン */}
            <path
              d="M35 25 Q42 30 50 35"
              stroke="#DAA520"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M65 40 Q72 45 80 50"
              stroke="#DAA520"
              strokeWidth="2"
              fill="none"
            />
            
            {/* チェーンリンク */}
            <ellipse cx="42" cy="30" rx="3" ry="2" fill="none" stroke="#DAA520" strokeWidth="1.5" />
            <ellipse cx="72" cy="45" rx="3" ry="2" fill="none" stroke="#DAA520" strokeWidth="1.5" />
          </>
        );
      
      case 'cluster':
        return (
          <>
            {/* 鈴の集合 */}
            {getSingleBell(30, 20, 0.8, -15)}
            {getSingleBell(50, 15, 1.0, 0)}
            {getSingleBell(70, 20, 0.8, 15)}
            {getSingleBell(40, 45, 0.7, -5)}
            {getSingleBell(60, 45, 0.7, 5)}
            
            {/* 中央の結び目 */}
            <circle cx="50" cy="35" r="4" fill="#8B4513" />
            <circle cx="50" cy="35" r="2" fill="#DAA520" />
            
            {/* 接続線 */}
            <line x1="50" y1="31" x2="40" y2="25" stroke="#654321" strokeWidth="1.5" />
            <line x1="50" y1="31" x2="60" y2="25" stroke="#654321" strokeWidth="1.5" />
            <line x1="50" y1="39" x2="45" y2="48" stroke="#654321" strokeWidth="1.5" />
            <line x1="50" y1="39" x2="55" y2="48" stroke="#654321" strokeWidth="1.5" />
          </>
        );
      
      default: // single
        return (
          <>
            {getSingleBell(0, 0, 1, 0)}
          </>
        );
    }
  };

  return (
    <div className={`${getSizeClasses()} ${animate ? 'animate-bell-ring' : ''} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md"
      >
        {getSvgContent()}
      </svg>
    </div>
  );
}