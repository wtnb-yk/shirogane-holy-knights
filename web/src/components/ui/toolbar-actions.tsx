import type { ReactNode } from 'react';

type IconButtonProps = {
  title: string;
  onClick?: () => void;
  badge?: number;
  className?: string;
  children: ReactNode;
};

export function ToolbarIconButton({
  title,
  onClick,
  badge,
  className = '',
  children,
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative w-9 h-9 flex items-center justify-center text-muted hover:text-heading hover:bg-surface-hover rounded-sm cursor-pointer transition-all duration-250 ease-out-expo ${className}`}
      title={title}
    >
      {children}
      {badge != null && badge > 0 && (
        <span className="absolute top-0.5 right-0.5 min-w-[14px] h-[14px] px-1 bg-accent text-white font-mono text-3xs font-semibold rounded-full text-center leading-[14px]">
          {badge}
        </span>
      )}
    </button>
  );
}
