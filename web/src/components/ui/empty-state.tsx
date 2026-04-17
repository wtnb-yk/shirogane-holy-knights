import type { ReactNode } from 'react';
import { Button } from './button';

type Props = {
  message: ReactNode;
  ctaLabel: string;
  ctaHref: string;
};

export function EmptyState({ message, ctaLabel, ctaHref }: Props) {
  return (
    <div className="flex flex-col items-center gap-xl py-2xl">
      {/* ゴーストプレビュー */}
      <div className="w-full max-w-[400px] opacity-25 blur-[1px]">
        <div className="h-20 bg-surface-hover rounded-md mb-md" />
        <div className="h-3 w-[60%] bg-border rounded-[2px] mb-sm" />
        <div className="h-3 w-[80%] bg-border rounded-[2px] mb-sm" />
        <div className="h-3 w-[40%] bg-border rounded-[2px]" />
      </div>
      {/* 誘導 */}
      <div className="text-center">
        <p className="text-sm text-secondary leading-[1.8] mb-md">{message}</p>
        <a href={ctaHref}>
          <Button variant="cta">{ctaLabel}</Button>
        </a>
      </div>
    </div>
  );
}
