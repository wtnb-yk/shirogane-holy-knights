import React from 'react';

interface FloatingParticlesProps {
  count?: number;
  className?: string;
  variant?: 'stars' | 'circles' | 'sparkles';
}

export function FloatingParticles({ count = 20, className = '', variant = 'stars' }: FloatingParticlesProps) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
  }));

  const getParticleShape = (particle: typeof particles[0]) => {
    switch (variant) {
      case 'circles':
        return (
          <circle
            cx="0"
            cy="0"
            r={particle.size / 2}
            fill="currentColor"
            opacity="0.6"
          />
        );
      case 'sparkles':
        return (
          <g fill="currentColor" opacity="0.7">
            <path d={`M0,-${particle.size} L${particle.size/3},0 L0,${particle.size} L-${particle.size/3},0 Z`} />
            <path d={`M-${particle.size},0 L0,${particle.size/3} L${particle.size},0 L0,-${particle.size/3} Z`} />
          </g>
        );
      default: // stars
        return (
          <path
            d={`M0,-${particle.size} L${particle.size/3},-${particle.size/3} L${particle.size},0 L${particle.size/3},${particle.size/3} L0,${particle.size} L-${particle.size/3},${particle.size/3} L-${particle.size},0 L-${particle.size/3},-${particle.size/3} Z`}
            fill="currentColor"
            opacity="0.6"
          />
        );
    }
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg className="w-full h-full">
        {particles.map((particle) => (
          <g
            key={particle.id}
            className={`animate-float hidden sm:block`}
            style={{
              transform: `translate(${particle.x}%, ${particle.y}%)`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          >
            {getParticleShape(particle)}
          </g>
        ))}
      </svg>
    </div>
  );
}