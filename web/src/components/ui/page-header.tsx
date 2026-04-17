import type { ReactNode } from 'react';

type Props = {
  title: string;
  description: string;
  right?: ReactNode;
};

export function PageHeader({ title, description, right }: Props) {
  return (
    <div className="max-w-[var(--content-max)] mx-auto px-md md:px-lg pt-lg pb-sm">
      <div className="flex items-center justify-between gap-lg">
        <h1 className="font-display text-xl font-semibold text-heading leading-[1.3]">
          {title}
        </h1>
        {right}
      </div>
      <p className="text-xs text-muted mt-1 leading-[1.6]">{description}</p>
    </div>
  );
}
