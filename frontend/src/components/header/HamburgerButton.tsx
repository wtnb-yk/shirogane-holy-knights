'use client';

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
}

export function HamburgerButton({ isOpen, onClick, onKeyDown }: HamburgerButtonProps) {
  return (
    <button
      onClick={onClick}
      onKeyDown={onKeyDown}
      className="lg:hidden flex items-center justify-center w-10 h-10 p-1 rounded-md text-white hover:text-white hover:bg-bg-primary/30 transition-all duration-ui active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-offset-2 focus:ring-offset-surface-primary"
      aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
      aria-haspopup="true"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        {isOpen ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
        )}
      </svg>
    </button>
  );
}