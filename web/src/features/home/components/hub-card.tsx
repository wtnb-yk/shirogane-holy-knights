import type { ReactNode, CSSProperties } from 'react';

const BASE =
  'rounded-lg p-lg flex flex-col transition-all duration-300 ease-out-expo hover:shadow-card';

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function HubCard({
  children,
  className = 'bg-surface border border-border hover:border-border-hover',
  style,
}: Props) {
  return (
    <div className={`${BASE} ${className}`} style={style}>
      {children}
    </div>
  );
}
