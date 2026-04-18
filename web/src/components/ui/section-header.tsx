import type { ReactNode } from 'react';

type Props = {
  label: string;
  title: string;
  description?: ReactNode;
};

export function SectionHeader({ label, title, description }: Props) {
  return (
    <div className="text-center px-md md:px-lg">
      <p className="font-mono text-2xs font-medium tracking-wider text-accent-label uppercase mb-sm">
        {label}
      </p>
      <h1 className="font-body text-xl md:text-2xl font-bold text-heading">
        {title}
      </h1>
      {description != null && (
        <div className="text-sm text-muted max-w-[var(--section-desc-max)] mx-auto mt-sm leading-relaxed-plus">
          {description}
        </div>
      )}
    </div>
  );
}
