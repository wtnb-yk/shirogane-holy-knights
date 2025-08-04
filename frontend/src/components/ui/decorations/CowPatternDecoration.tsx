import React from 'react';

interface CowPatternDecorationProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spots' | 'patches' | 'scattered';
  className?: string;
  animate?: boolean;
}

export function CowPatternDecoration({ 
  size = 'md', 
  variant = 'spots', 
  className = '', 
  animate = false 
}: CowPatternDecorationProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-12 h-12';
      case 'md': return 'w-16 h-16';
      case 'lg': return 'w-24 h-24';
      case 'xl': return 'w-32 h-32';
      default: return 'w-16 h-16';
    }
  };

  const getSvgContent = () => {
    switch (variant) {
      case 'patches':
        return (
          <>
            {/* 大きなパッチ柄 */}
            <rect width="100" height="100" fill="#FEFEFE" />
            
            <path
              d="M10 20 Q20 15 35 20 Q40 25 35 35 Q25 40 15 35 Q5 30 10 20"
              fill="#2D2D2D"
            />
            
            <path
              d="M60 10 Q75 8 85 15 Q90 25 85 35 Q75 40 65 35 Q55 25 60 10"
              fill="#2D2D2D"
            />
            
            <path
              d="M20 60 Q35 55 45 65 Q50 75 40 85 Q25 90 15 80 Q10 70 20 60"
              fill="#2D2D2D"
            />
            
            <path
              d="M70 50 Q85 48 90 60 Q95 70 85 80 Q75 85 65 75 Q60 65 70 50"
              fill="#2D2D2D"
            />
            
            <circle cx="45" cy="25" r="6" fill="#2D2D2D" />
            <circle cx="25" cy="45" r="4" fill="#2D2D2D" />
            <circle cx="75" cy="75" r="5" fill="#2D2D2D" />
          </>
        );
      
      case 'scattered':
        return (
          <>
            {/* 散らばった斑点 */}
            <rect width="100" height="100" fill="#FEFEFE" />
            
            <circle cx="15" cy="15" r="3" fill="#2D2D2D" />
            <circle cx="35" cy="12" r="4" fill="#2D2D2D" />
            <circle cx="60" cy="18" r="2.5" fill="#2D2D2D" />
            <circle cx="80" cy="25" r="3.5" fill="#2D2D2D" />
            
            <circle cx="25" cy="35" r="5" fill="#2D2D2D" />
            <circle cx="50" cy="40" r="3" fill="#2D2D2D" />
            <circle cx="75" cy="32" r="4" fill="#2D2D2D" />
            
            <circle cx="10" cy="55" r="2.5" fill="#2D2D2D" />
            <circle cx="40" cy="60" r="4.5" fill="#2D2D2D" />
            <circle cx="65" cy="55" r="3" fill="#2D2D2D" />
            <circle cx="85" cy="60" r="2" fill="#2D2D2D" />
            
            <circle cx="20" cy="75" r="3.5" fill="#2D2D2D" />
            <circle cx="45" cy="80" r="2.5" fill="#2D2D2D" />
            <circle cx="70" cy="78" r="4" fill="#2D2D2D" />
            <circle cx="90" cy="85" r="3" fill="#2D2D2D" />
            
            {/* 小さな点々 */}
            <circle cx="30" cy="25" r="1.5" fill="#2D2D2D" />
            <circle cx="55" cy="28" r="1" fill="#2D2D2D" />
            <circle cx="15" cy="40" r="1.5" fill="#2D2D2D" />
            <circle cx="85" cy="45" r="1" fill="#2D2D2D" />
            <circle cx="35" cy="50" r="1.5" fill="#2D2D2D" />
            <circle cx="60" cy="70" r="1" fill="#2D2D2D" />
            <circle cx="25" cy="90" r="1.5" fill="#2D2D2D" />
            <circle cx="80" cy="95" r="1" fill="#2D2D2D" />
          </>
        );
      
      default: // spots
        return (
          <>
            {/* クラシックな牛斑点 */}
            <rect width="100" height="100" fill="#FEFEFE" />
            
            {/* 大きな斑点 */}
            <path
              d="M15 25 Q25 20 35 25 Q40 35 30 40 Q20 35 15 25"
              fill="#2D2D2D"
            />
            
            <path
              d="M55 15 Q70 12 80 20 Q85 30 75 35 Q65 32 55 15"
              fill="#2D2D2D"
            />
            
            <path
              d="M25 55 Q40 50 50 60 Q45 70 35 75 Q20 70 25 55"
              fill="#2D2D2D"
            />
            
            <path
              d="M65 45 Q80 40 90 50 Q95 65 80 70 Q70 65 65 45"
              fill="#2D2D2D"
            />
            
            {/* 中くらいの斑点 */}
            <ellipse cx="45" cy="30" rx="8" ry="6" fill="#2D2D2D" />
            <ellipse cx="20" cy="80" rx="6" ry="8" fill="#2D2D2D" />
            <ellipse cx="75" cy="80" rx="7" ry="5" fill="#2D2D2D" />
            
            {/* 小さな斑点 */}
            <circle cx="10" cy="10" r="3" fill="#2D2D2D" />
            <circle cx="90" cy="15" r="2.5" fill="#2D2D2D" />
            <circle cx="15" cy="45" r="2" fill="#2D2D2D" />
            <circle cx="55" cy="85" r="3" fill="#2D2D2D" />
            <circle cx="85" cy="90" r="2" fill="#2D2D2D" />
          </>
        );
    }
  };

  return (
    <div className={`${getSizeClasses()} ${animate ? 'animate-pulse' : ''} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
      >
        {getSvgContent()}
      </svg>
    </div>
  );
}