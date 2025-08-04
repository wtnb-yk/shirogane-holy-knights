import React from 'react';

interface ShieldDecorationProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'knight' | 'royal' | 'heraldic';
  className?: string;
  animate?: boolean;
}

export function ShieldDecoration({ 
  size = 'md', 
  variant = 'knight', 
  className = '', 
  animate = false 
}: ShieldDecorationProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-8 h-10';
      case 'md': return 'w-12 h-15';
      case 'lg': return 'w-16 h-20';
      case 'xl': return 'w-24 h-30';
      default: return 'w-12 h-15';
    }
  };

  const getSvgContent = () => {
    switch (variant) {
      case 'royal':
        return (
          <>
            <defs>
              <linearGradient id={`royalGradient-${variant}-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#FFA500', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#FF8C00', stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id={`royalAccent-${variant}-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#FF69B4', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#FF1493', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            
            {/* 盾の形 */}
            <path
              d="M50 5 Q75 10 80 35 Q78 60 70 75 Q60 85 50 90 Q40 85 30 75 Q22 60 20 35 Q25 10 50 5"
              fill={`url(#royalGradient-${variant}-${size})`}
              stroke="#DAA520"
              strokeWidth="2"
            />
            
            {/* 中央の紋章 */}
            <circle cx="50" cy="35" r="12" fill={`url(#royalAccent-${variant}-${size})`} />
            <path
              d="M50 25 L55 35 L50 45 L45 35 Z"
              fill="#FFFFFF"
            />
            
            {/* 装飾ライン */}
            <path
              d="M35 20 Q50 18 65 20"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              opacity="0.8"
            />
            <path
              d="M30 50 Q50 48 70 50"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              opacity="0.8"
            />
            
            {/* 装飾的なエッジ */}
            <path
              d="M50 5 Q75 10 80 35 Q78 60 70 75 Q60 85 50 90 Q40 85 30 75 Q22 60 20 35 Q25 10 50 5"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1"
              opacity="0.6"
            />
          </>
        );
      
      case 'heraldic':
        return (
          <>
            <defs>
              <linearGradient id={`heraldicGradient-${variant}-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#E0E0E0', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#C0C0C0', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#A0A0A0', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            
            {/* 盾の形 */}
            <path
              d="M50 8 Q70 12 75 35 Q73 58 65 72 Q55 82 50 85 Q45 82 35 72 Q27 58 25 35 Q30 12 50 8"
              fill={`url(#heraldicGradient-${variant}-${size})`}
              stroke="#808080"
              strokeWidth="1.5"
            />
            
            {/* 紋章的な分割 */}
            <path
              d="M25 35 Q50 33 75 35"
              stroke="#4169E1"
              strokeWidth="2"
              fill="none"
            />
            
            {/* 上部の紋章 */}
            <rect x="40" y="18" width="20" height="12" fill="#4169E1" />
            <path
              d="M45 22 L50 18 L55 22 L50 26 Z"
              fill="#FFD700"
            />
            
            {/* 下部の装飾 */}
            <circle cx="40" cy="50" r="3" fill="#DC143C" />
            <circle cx="50" cy="55" r="3" fill="#DC143C" />
            <circle cx="60" cy="50" r="3" fill="#DC143C" />
            
            {/* 装飾ライン */}
            <path
              d="M30 65 Q50 63 70 65"
              stroke="#FFD700"
              strokeWidth="1.5"
              fill="none"
            />
          </>
        );
      
      default: // knight
        return (
          <>
            <defs>
              <linearGradient id={`knightGradient-${variant}-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#B0B0B0', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#D0D0D0', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#A0A0A0', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            
            {/* 盾の形 */}
            <path
              d="M50 10 Q68 14 72 35 Q70 56 62 70 Q52 80 50 82 Q48 80 38 70 Q30 56 28 35 Q32 14 50 10"
              fill={`url(#knightGradient-${variant}-${size})`}
              stroke="#666"
              strokeWidth="1.5"
            />
            
            {/* 中央の十字 */}
            <rect x="47" y="25" width="6" height="20" fill="#4169E1" />
            <rect x="40" y="32" width="20" height="6" fill="#4169E1" />
            
            {/* 装飾的なリベット */}
            <circle cx="40" cy="20" r="1.5" fill="#333" />
            <circle cx="60" cy="20" r="1.5" fill="#333" />
            <circle cx="35" cy="35" r="1.5" fill="#333" />
            <circle cx="65" cy="35" r="1.5" fill="#333" />
            <circle cx="40" cy="55" r="1.5" fill="#333" />
            <circle cx="60" cy="55" r="1.5" fill="#333" />
            
            {/* エッジのハイライト */}
            <path
              d="M50 10 Q68 14 72 35"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1"
              opacity="0.6"
            />
          </>
        );
    }
  };

  return (
    <div className={`${getSizeClasses()} ${animate ? 'animate-shield-shine' : ''} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-lg"
      >
        {getSvgContent()}
      </svg>
    </div>
  );
}