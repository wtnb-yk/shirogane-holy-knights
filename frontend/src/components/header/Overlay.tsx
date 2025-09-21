'use client';

interface OverlayProps {
  isVisible: boolean;
  onClick: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
}

export function Overlay({ isVisible, onClick, onKeyDown }: OverlayProps) {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/20 z-40"
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-hidden="true"
    />
  );
}