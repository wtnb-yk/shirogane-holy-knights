import React from 'react';

interface HoofDecorationProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'single' | 'trail' | 'walking';
  className?: string;
  animate?: boolean;
}

export function HoofDecoration({ 
  size = 'md', 
  variant = 'single', 
  className = '', 
  animate = false 
}: HoofDecorationProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-8 h-8';
      case 'md': return 'w-12 h-12';
      case 'lg': return 'w-16 h-16';
      case 'xl': return 'w-24 h-24';
      default: return 'w-12 h-12';
    }
  };

  const getSingleHoof = (x: number, y: number, scale: number = 1) => (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* 蹄の形 */}
      <path
        d="M50 20 Q60 25 60 40 Q58 55 50 60 Q42 55 40 40 Q40 25 50 20"
        fill="#2D2D2D"
        stroke="#1A1A1A"
        strokeWidth="1"
      />
      
      {/* 蹄の割れ目 */}
      <line
        x1="50"
        y1="25"
        x2="50"
        y2="55"
        stroke="#666"
        strokeWidth="1.5"
      />
      
      {/* 左右の蹄片 */}
      <path
        d="M45 30 Q42 35 42 45 Q44 50 48 52"
        fill="none"
        stroke="#999"
        strokeWidth="0.8"
      />
      <path
        d="M55 30 Q58 35 58 45 Q56 50 52 52"
        fill="none"
        stroke="#999"
        strokeWidth="0.8"
      />
    </g>
  );

  const getSvgContent = () => {
    switch (variant) {
      case 'trail':
        return (
          <>
            {/* 蹄の足跡 */}
            {getSingleHoof(10, 10, 0.6)}
            {getSingleHoof(30, 25, 0.7)}
            {getSingleHoof(50, 40, 0.8)}
            {getSingleHoof(70, 55, 0.9)}
            {getSingleHoof(90, 70, 1.0)}
          </>
        );
      
      case 'walking':
        return (
          <>
            {/* 歩く蹄の軌跡 */}
            {getSingleHoof(20, 20, 0.8)}
            {getSingleHoof(60, 15, 0.8)}
            {getSingleHoof(25, 50, 0.9)}
            {getSingleHoof(65, 45, 0.9)}
            {getSingleHoof(30, 80, 1.0)}
            {getSingleHoof(70, 75, 1.0)}
            
            {/* 薄い足跡 */}
            <g opacity="0.3">
              {getSingleHoof(5, 35, 0.5)}
              {getSingleHoof(45, 30, 0.5)}
              {getSingleHoof(10, 65, 0.6)}
              {getSingleHoof(50, 60, 0.6)}
              {getSingleHoof(85, 85, 0.7)}
            </g>
          </>
        );
      
      default: // single
        return (
          <>
            {getSingleHoof(0, 0, 1)}
          </>
        );
    }
  };

  return (
    <div className={`${getSizeClasses()} ${animate ? 'animate-bounce' : ''} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
      >
        {getSvgContent()}
      </svg>
    </div>
  );
}