type Variant = 'filter' | 'gold' | 'small';

type Props = {
  label: string;
  variant?: Variant;
  active?: boolean;
  onClick?: () => void;
  className?: string;
};

const filterBase =
  'inline-block px-3 py-1 font-body text-2xs font-medium rounded-full border cursor-pointer transition-all duration-250 ease-out-expo select-none whitespace-nowrap';
const filterDefault =
  'bg-surface text-interactive border-border hover:border-border-strong hover:bg-surface-hover';
const filterActive = 'bg-heading text-surface border-heading';
const goldActive = 'bg-accent text-white border-accent';

export function TagPill({
  label,
  variant = 'filter',
  active = false,
  onClick,
  className = '',
}: Props) {
  if (variant === 'small') {
    return (
      <span
        className={`inline-block px-1.5 bg-[var(--glow-navy)] dark:bg-white/6 text-secondary font-mono text-3xs rounded-xs tracking-normal ${className}`}
      >
        {label}
      </span>
    );
  }

  const activeStyle = variant === 'gold' ? goldActive : filterActive;

  return (
    <button
      onClick={onClick}
      className={`${filterBase} ${active ? activeStyle : filterDefault} ${className}`}
    >
      {label}
    </button>
  );
}
