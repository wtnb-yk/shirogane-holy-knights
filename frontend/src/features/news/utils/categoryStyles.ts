export const getCategoryBadgeStyle = (categoryName: string, includeHover: boolean = true) => {
  const baseStyle = (bgColor: string, textColor: string, borderColor: string) => {
    const base = `bg-${bgColor}/20 text-${textColor} border-${borderColor}/30`;
    return includeHover 
      ? `${base} hover:bg-${bgColor}/30 transition-all duration-ui`
      : base;
  };

  switch (categoryName.toLowerCase()) {
    case 'goods':
      return baseStyle('badge-blue', 'badge-blue', 'badge-blue');
    case 'collaboration':
      return baseStyle('badge-green', 'badge-green', 'badge-green');
    case 'event':
      return baseStyle('badge-orange', 'badge-orange', 'badge-orange');
    case 'media':
      return baseStyle('badge-purple', 'badge-purple', 'badge-purple');
    case 'campaign':
      return baseStyle('badge-pink', 'badge-pink', 'badge-pink');
    case 'others':
    default:
      return baseStyle('badge-gray', 'badge-gray', 'badge-gray');
  }
};

export const getCategoryButtonStyle = (categoryName: string, isSelected: boolean) => {
  const baseStyle = 'px-4 py-2 rounded-full font-medium transition-all duration-200';
  
  if (isSelected) {
    switch (categoryName.toLowerCase()) {
      case 'goods':
        return `${baseStyle} bg-badge-blue text-white shadow-md ring-2 ring-badge-blue/30`;
      case 'collaboration':
        return `${baseStyle} bg-badge-green text-white shadow-md ring-2 ring-badge-green/30`;
      case 'event':
        return `${baseStyle} bg-badge-orange text-white shadow-md ring-2 ring-badge-orange/30`;
      case 'media':
        return `${baseStyle} bg-badge-purple text-white shadow-md ring-2 ring-badge-purple/30`;
      case 'campaign':
        return `${baseStyle} bg-badge-pink text-white shadow-md ring-2 ring-badge-pink/30`;
      case 'others':
      default:
        return `${baseStyle} bg-badge-gray text-white shadow-md ring-2 ring-badge-gray/30`;
    }
  } else {
    return `${baseStyle} bg-bg-primary text-text-secondary border border-surface-border hover:bg-bg-accent`;
  }
};