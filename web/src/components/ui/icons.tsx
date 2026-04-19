type IconProps = {
  className?: string;
};

export function DownloadIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <path d="M8 2v9M4 8l4 4 4-4" />
      <path d="M2 13h12" />
    </svg>
  );
}

export function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M12.6 1h2.4l-5.3 6.1L16 15h-4.9l-3.8-5-4.4 5H.5l5.7-6.5L.2 1h5l3.5 4.6L12.6 1zm-.8 12.6h1.3L4.3 2.3H2.9l8.9 11.3z" />
    </svg>
  );
}

export function ExternalLinkIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <path d="M7 3L13 3L13 9" />
      <path d="M13 3L6 10" />
    </svg>
  );
}
