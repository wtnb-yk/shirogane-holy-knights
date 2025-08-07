export const STAGGER_ANIMATION = {
  delay: {
    base: 50,
    max: 300,
    calculate: (index: number) => Math.min(index * 50, 300),
  },
  duration: {
    card: 300,
    ui: 200,
    fast: 150,
  },
} as const;

export const CARD_STYLES = {
  hover: {
    scale: {
      small: '1.01',
      medium: '1.02',
    },
    shadow: 'hover:shadow-xl hover:shadow-text-secondary/20',
    transform: 'hover:-translate-y-1',
  },
  transition: 'transition-all duration-300',
} as const;

export const BACKGROUND_OPACITY = {
  accent: {
    light: 'bg-bg-accent/20',
    medium: 'bg-bg-accent/30',
    strong: 'bg-bg-accent/50',
    stronger: 'bg-bg-accent/70',
  },
  surface: {
    light: 'border-surface-border/50',
    medium: 'border-surface-border',
  },
} as const;

export const TEXT_CLAMP = {
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
} as const;

export const INTERACTIVE_STYLES = {
  button: {
    primary: 'px-8 py-3 bg-bg-primary text-text-primary border border-surface-border rounded-lg font-medium hover:bg-bg-accent transition-colors duration-200',
    secondary: 'px-8 py-3 border-2 text-white rounded-lg font-medium hover:bg-bg-primary hover:text-text-primary transition-colors duration-200',
  },
  input: {
    base: 'w-full px-3 py-2 border border-surface-border rounded-lg bg-bg-primary focus:ring-2 focus:ring-text-secondary focus:border-text-secondary transition-all duration-200 text-text-primary placeholder-text-secondary/70',
    withIcon: 'pl-10 pr-12 py-3',
  },
} as const;

export const IMAGE_STYLES = {
  hover: 'transition-transform duration-300 group-hover:scale-105',
  overlay: 'absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300',
  placeholder: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==',
} as const;

export const TOOLTIP_STYLES = {
  base: 'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-bg-primary border border-surface-border rounded-md shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs',
} as const;