export function SchedulePlaceholder() {
  return (
    <div className="bg-surface border border-border rounded-lg p-md md:p-lg border-l-[3px] border-l-accent flex flex-col hover:border-border-hover hover:shadow-card-hover transition-all duration-300 ease-out-expo">
      <div className="flex items-baseline mb-md">
        <span className="font-display text-base font-semibold text-heading">
          スケジュール
        </span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center py-lg">
        <div className="w-[32px] h-0.5 bg-accent rounded-[1px] opacity-50 mb-md" />
        <p className="text-xs text-subtle leading-relaxed">
          今後のスケジュール連携を
          <br />
          準備中です
        </p>
      </div>
      <div className="mt-auto pt-md font-mono text-3xs text-faint tracking-wide uppercase">
        coming soon
      </div>
    </div>
  );
}
