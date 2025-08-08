import { NewsCategory } from '@/constants/newsCategories';

export const getCategoryBadgeStyle = (categoryName: string, includeHover: boolean = true) => {
  const baseStyle = (bgColor: string, textColor: string, borderColor: string) => {
    const base = `bg-${bgColor}/20 text-${textColor} border-${borderColor}/30`;
    return includeHover 
      ? `${base} hover:bg-${bgColor}/30 transition-all duration-ui`
      : base;
  };

  switch (categoryName.toLowerCase() as NewsCategory) {
    case NewsCategory.GOODS:
      return baseStyle('badge-blue', 'badge-blue', 'badge-blue');
    case NewsCategory.COLLABORATION:
      return baseStyle('badge-green', 'badge-green', 'badge-green');
    case NewsCategory.EVENT:
      return baseStyle('badge-orange', 'badge-orange', 'badge-orange');
    case NewsCategory.MEDIA:
      return baseStyle('badge-purple', 'badge-purple', 'badge-purple');
    case NewsCategory.CAMPAIGN:
      return baseStyle('badge-pink', 'badge-pink', 'badge-pink');
    case NewsCategory.OTHERS:
    default:
      return baseStyle('badge-gray', 'badge-gray', 'badge-gray');
  }
};

export const getCategoryButtonStyle = (categoryName: string, isSelected: boolean) => {
  const baseStyle = 'px-4 py-2 rounded-full font-medium transition-all duration-200';
  
  if (isSelected) {
    switch (categoryName.toLowerCase() as NewsCategory) {
      case NewsCategory.GOODS:
        return `${baseStyle} bg-badge-blue text-white shadow-md ring-2 ring-badge-blue/30`;
      case NewsCategory.COLLABORATION:
        return `${baseStyle} bg-badge-green text-white shadow-md ring-2 ring-badge-green/30`;
      case NewsCategory.EVENT:
        return `${baseStyle} bg-badge-orange text-white shadow-md ring-2 ring-badge-orange/30`;
      case NewsCategory.MEDIA:
        return `${baseStyle} bg-badge-purple text-white shadow-md ring-2 ring-badge-purple/30`;
      case NewsCategory.CAMPAIGN:
        return `${baseStyle} bg-badge-pink text-white shadow-md ring-2 ring-badge-pink/30`;
      case NewsCategory.OTHERS:
      default:
        return `${baseStyle} bg-badge-gray text-white shadow-md ring-2 ring-badge-gray/30`;
    }
  } else {
    return `${baseStyle} bg-bg-primary text-text-secondary border border-surface-border hover:bg-bg-accent`;
  }
};