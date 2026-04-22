type Props = {
  isPlaying: boolean;
};

/** インライン再生トグル用の丸型アイコン（再生三角） */
export function PlayToggleIcon({ isPlaying }: Props) {
  return (
    <div
      className={`size-4.5 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity duration-250 ease-out-expo ${
        isPlaying
          ? 'opacity-100 bg-accent text-surface'
          : 'opacity-0 bg-[var(--glow-gold)] text-accent-label'
      }`}
    >
      <svg className="size-2 ml-px" viewBox="0 0 12 12" fill="currentColor">
        <path d="M3 1.5l7.5 4.5-7.5 4.5z" />
      </svg>
    </div>
  );
}
