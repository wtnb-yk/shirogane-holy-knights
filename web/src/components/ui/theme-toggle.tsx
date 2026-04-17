'use client';

function SunIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <circle cx="10" cy="10" r="3.5" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="10" y1="16" x2="10" y2="18" />
      <line x1="2" y1="10" x2="4" y2="10" />
      <line x1="16" y1="10" x2="18" y2="10" />
      <line x1="4.34" y1="4.34" x2="5.76" y2="5.76" />
      <line x1="14.24" y1="14.24" x2="15.66" y2="15.66" />
      <line x1="4.34" y1="15.66" x2="5.76" y2="14.24" />
      <line x1="14.24" y1="5.76" x2="15.66" y2="4.34" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.39 12.24A7.5 7.5 0 0 1 7.76 2.61a7.5 7.5 0 1 0 9.63 9.63z" />
    </svg>
  );
}

export function ThemeToggle() {
  const toggle = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center justify-center w-8 h-8 rounded-sm text-header-text hover:text-white hover:bg-white/8 transition-all duration-250 ease-out-expo cursor-pointer"
      aria-label="テーマ切替"
    >
      <span className="hidden dark:flex">
        <SunIcon />
      </span>
      <span className="flex dark:hidden">
        <MoonIcon />
      </span>
    </button>
  );
}
