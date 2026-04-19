'use client';

import type { ReportTheme } from './report-card';

type Props = {
  theme: ReportTheme;
  onThemeChange: (theme: ReportTheme) => void;
};

const THEMES: { key: ReportTheme; label: string; dotClass: string }[] = [
  {
    key: 'light',
    label: 'ライト',
    dotClass: 'bg-[var(--color-cream-50)] border-[var(--color-cream-400)]',
  },
  {
    key: 'dark',
    label: 'ダーク',
    dotClass: 'bg-[var(--color-navy-800)] border-[var(--color-navy-600)]',
  },
  {
    key: 'gold',
    label: 'ゴールド',
    dotClass:
      'bg-gradient-to-br from-[var(--color-gold-200)] to-[var(--color-gold-400)] border-[var(--color-gold-300)]',
  },
];

export function ThemeSelector({ theme, onThemeChange }: Props) {
  return (
    <div className="flex items-center gap-sm mb-md animate-card-entrance">
      <span className="font-mono text-3xs text-muted tracking-[0.06em]">
        THEME
      </span>
      <div className="flex gap-0 rounded-sm bg-surface p-[3px]">
        {THEMES.map((t) => (
          <button
            key={t.key}
            onClick={() => onThemeChange(t.key)}
            className={`flex items-center gap-[5px] px-[10px] py-1 font-mono text-2xs font-medium rounded-xs cursor-pointer transition-all duration-200 ease-out-expo ${
              theme === t.key
                ? 'bg-page text-heading shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                : 'text-secondary hover:text-heading'
            }`}
          >
            <span
              className={`w-[10px] h-[10px] rounded-full border shrink-0 ${t.dotClass}`}
            />
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
