export const getEventTypeLabel = (type: string): string => {
  switch (type) {
    case 'event':
      return 'イベント';
    case 'goods':
      return 'グッズ';
    case 'campaign':
      return 'キャンペーン';
    default:
      return type;
  }
};