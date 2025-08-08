import { NewsCategory } from '@/constants/newsCategories';

export const getCategoryBadgeStyle = (categoryName: string, includeHover: boolean = true) => {
  switch (categoryName.toLowerCase() as NewsCategory) {
    case NewsCategory.GOODS:
      return `bg-badge-blue/20 text-badge-blue border-badge-blue/30${includeHover ? ' hover:bg-badge-blue/30 transition-all duration-ui' : ''}`;
    case NewsCategory.COLLABORATION:
      return `bg-badge-green/20 text-badge-green border-badge-green/30${includeHover ? ' hover:bg-badge-green/30 transition-all duration-ui' : ''}`;
    case NewsCategory.EVENT:
      return `bg-badge-orange/20 text-badge-orange border-badge-orange/30${includeHover ? ' hover:bg-badge-orange/30 transition-all duration-ui' : ''}`;
    case NewsCategory.MEDIA:
      return `bg-badge-purple/20 text-badge-purple border-badge-purple/30${includeHover ? ' hover:bg-badge-purple/30 transition-all duration-ui' : ''}`;
    case NewsCategory.CAMPAIGN:
      return `bg-badge-pink/20 text-badge-pink border-badge-pink/30${includeHover ? ' hover:bg-badge-pink/30 transition-all duration-ui' : ''}`;
    case NewsCategory.OTHERS:
    default:
      return `bg-badge-gray/20 text-badge-gray border-badge-gray/30${includeHover ? ' hover:bg-badge-gray/30 transition-all duration-ui' : ''}`;
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