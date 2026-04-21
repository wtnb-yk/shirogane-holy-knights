import type { ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  iconBg: string;
  label: string;
  title: string;
  labelClassName?: string;
  titleClassName?: string;
  className?: string;
  children?: ReactNode;
};

export function HubCardHeader({
  icon,
  iconBg,
  label,
  title,
  labelClassName = 'font-mono text-3xs tracking-wider text-accent-label uppercase',
  titleClassName = 'font-display text-base font-semibold text-heading',
  className = 'mb-xs',
  children,
}: Props) {
  return (
    <div className={`flex items-start gap-sm ${className}`}>
      <div
        className="w-xl h-xl rounded-full flex items-center justify-center shrink-0"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className={labelClassName}>{label}</div>
        <h2 className={titleClassName}>{title}</h2>
      </div>
      {children}
    </div>
  );
}
