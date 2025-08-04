import React from 'react';

interface SectionDividerProps {
  variant?: 'wave' | 'zigzag' | 'ornate' | 'simple';
  className?: string;
  flip?: boolean;
}

export function SectionDivider({ variant = 'wave', className = '', flip = false }: SectionDividerProps) {
  const getDividerVariant = () => {
    switch (variant) {
      case 'zigzag':
        return (
          <svg viewBox="0 0 400 40" className="w-full h-full">
            <path
              d="M0 20 L50 10 L100 30 L150 10 L200 30 L250 10 L300 30 L350 10 L400 20 L400 40 L0 40 Z"
              fill="currentColor"
              opacity="0.1"
            />
            <path
              d="M0 20 L50 10 L100 30 L150 10 L200 30 L250 10 L300 30 L350 10 L400 20"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />
          </svg>
        );
      case 'ornate':
        return (
          <svg viewBox="0 0 400 60" className="w-full h-full">
            {/* 装飾的な波形 */}
            <path
              d="M0 30 Q50 10, 100 30 T200 30 T300 30 T400 30"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.4"
            />
            {/* 装飾要素 */}
            <circle cx="100" cy="30" r="4" fill="currentColor" opacity="0.3" />
            <circle cx="200" cy="30" r="4" fill="currentColor" opacity="0.3" />
            <circle cx="300" cy="30" r="4" fill="currentColor" opacity="0.3" />
            {/* 小さな装飾 */}
            <path d="M95 25 L100 20 L105 25 L100 35 Z" fill="currentColor" opacity="0.2" />
            <path d="M195 25 L200 20 L205 25 L200 35 Z" fill="currentColor" opacity="0.2" />
            <path d="M295 25 L300 20 L305 25 L300 35 Z" fill="currentColor" opacity="0.2" />
          </svg>
        );
      case 'simple':
        return (
          <svg viewBox="0 0 400 20" className="w-full h-full">
            <line
              x1="0"
              y1="10"
              x2="400"
              y2="10"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.3"
            />
            <circle cx="200" cy="10" r="3" fill="currentColor" opacity="0.4" />
          </svg>
        );
      default: // wave
        return (
          <svg viewBox="0 0 400 50" className="w-full h-full">
            <path
              d="M0 25 Q100 5, 200 25 T400 25 L400 50 L0 50 Z"
              fill="currentColor"
              opacity="0.08"
            />
            <path
              d="M0 25 Q100 5, 200 25 T400 25"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.2"
            />
          </svg>
        );
    }
  };

  return (
    <div className={`w-full h-12 text-noel-primary ${flip ? 'scale-y-[-1]' : ''} ${className}`}>
      {getDividerVariant()}
    </div>
  );
}