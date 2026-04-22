const HEART_PATH =
  'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z';

type Props = {
  active: boolean;
  onClick: () => void;
  size?: 'sm' | 'md';
};

export function FavButton({ active, onClick, size = 'md' }: Props) {
  const dim = size === 'sm' ? 'w-6 h-6' : 'w-7 h-7';
  const icon = size === 'sm' ? 'w-3.5 h-3.5' : 'w-3.5 h-3.5';

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
      }}
      className={`${dim} flex items-center justify-center flex-shrink-0 rounded-full border-none p-0 cursor-pointer transition-all duration-250 ease-out-expo ${
        active
          ? 'text-accent bg-[var(--glow-gold)]'
          : 'text-subtle bg-surface-hover hover:text-accent-label hover:scale-110 hover:bg-[var(--glow-gold)]'
      }`}
    >
      <svg
        className={icon}
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={HEART_PATH} />
      </svg>
    </button>
  );
}
