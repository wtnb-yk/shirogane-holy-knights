export const getAlbumTypeBadgeStyle = (typeName: string): string => {
  const type = typeName.toLowerCase();

  switch (type) {
    case 'single':
      return 'bg-badge-blue/20 text-badge-blue border-badge-blue/30 hover:bg-badge-blue/30 transition-all duration-ui';
    case 'album':
      return 'bg-badge-green/20 text-badge-green border-badge-green/30 hover:bg-badge-green/30 transition-all duration-ui';
    case 'compilation':
      return 'bg-badge-orange/20 text-badge-orange border-badge-orange/30 hover:bg-badge-orange/30 transition-all duration-ui';
    case 'mini_album':
    case 'ep':
      return 'bg-badge-purple/20 text-badge-purple border-badge-purple/30 hover:bg-badge-purple/30 transition-all duration-ui';
    default:
      return 'bg-badge-gray/20 text-badge-gray border-badge-gray/30 hover:bg-badge-gray/30 transition-all duration-ui';
  }
};

export const getAlbumTypeBadgeModalStyle = (typeName: string): string => {
  const type = typeName.toLowerCase();

  switch (type) {
    case 'single':
      return 'bg-badge-blue/80 text-white border-badge-blue hover:bg-badge-blue transition-all duration-ui';
    case 'album':
      return 'bg-badge-green/80 text-white border-badge-green hover:bg-badge-green transition-all duration-ui';
    case 'compilation':
      return 'bg-badge-orange/80 text-white border-badge-orange hover:bg-badge-orange transition-all duration-ui';
    case 'mini_album':
    case 'ep':
      return 'bg-badge-purple/80 text-white border-badge-purple hover:bg-badge-purple transition-all duration-ui';
    default:
      return 'bg-badge-gray/80 text-white border-badge-gray hover:bg-badge-gray transition-all duration-ui';
  }
};