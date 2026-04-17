import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'check' | 'cta';

const base =
  'inline-flex items-center cursor-pointer transition-all duration-300 ease-out-expo select-none disabled:opacity-40 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary:
    'gap-2 px-lg py-2.5 bg-heading text-surface font-body text-sm font-semibold border-none rounded-sm tracking-normal hover:bg-foreground hover:-translate-y-px hover:shadow-button-hover [&_svg]:w-4 [&_svg]:h-4',
  secondary:
    'gap-2 px-lg py-2.5 bg-transparent text-heading font-body text-sm font-semibold border border-border-strong rounded-sm tracking-normal hover:bg-heading hover:text-surface hover:border-heading hover:-translate-y-px [&_svg]:w-4 [&_svg]:h-4',
  ghost:
    'gap-1.5 px-md py-2 bg-transparent text-secondary font-body text-sm font-medium border-none rounded-sm hover:text-heading hover:bg-surface-hover',
  check: 'gap-1 px-2.5 py-2xs font-body text-2xs font-medium border rounded-sm',
  cta: 'justify-center px-xl py-3 bg-heading text-surface font-body text-sm font-semibold border-none rounded-sm tracking-normal hover:bg-foreground hover:-translate-y-px hover:shadow-button-hover',
};

const checkUnchecked =
  'bg-transparent text-interactive border-border-hover hover:bg-[var(--glow-navy)] hover:border-subtle hover:text-heading';
const checkChecked =
  'bg-foreground text-surface border-foreground hover:bg-secondary';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: Variant;
  checked?: boolean;
  children: ReactNode;
};

export function Button({
  variant,
  checked = false,
  className = '',
  children,
  ...rest
}: Props) {
  let cls = `${base} ${variants[variant]}`;
  if (variant === 'check') {
    cls += ` ${checked ? checkChecked : checkUnchecked}`;
  }

  return (
    <button className={`${cls} ${className}`} {...rest}>
      {children}
    </button>
  );
}
