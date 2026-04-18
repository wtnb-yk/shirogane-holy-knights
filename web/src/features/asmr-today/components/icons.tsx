type IconProps = {
  className?: string;
};

export function RetryIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <path d="M1 9a8 8 0 0 1 14.3-4.9M17 9a8 8 0 0 1-14.3 4.9" />
      <path d="M15.3 1v3.1h-3.1M2.7 17v-3.1h3.1" />
    </svg>
  );
}
