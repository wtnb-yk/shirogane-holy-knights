import type { ReactNode } from 'react';
import { SectionHeader } from './section-header';

type Props = {
  label: string;
  title: string;
  description: string;
  isEmpty: boolean;
  emptyContent: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
};

export function ShareCardLayout({
  label,
  title,
  description,
  isEmpty,
  emptyContent,
  actions,
  children,
}: Props) {
  return (
    <>
      <div className="pt-lg">
        <SectionHeader label={label} title={title} description={description} />
      </div>

      <div
        className="flex flex-col items-center px-lg max-md:px-md py-xl min-h-[60vh]"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 50% 30%, rgba(200,162,76,0.04) 0%, transparent 100%)',
        }}
      >
        {isEmpty ? (
          emptyContent
        ) : (
          <>
            {actions}
            {children}
          </>
        )}
      </div>
    </>
  );
}
