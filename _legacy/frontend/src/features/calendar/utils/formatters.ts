export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekDay = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
  return `${year}年${month}月${day}日（${weekDay}）`;
};

export const formatDateShort = (date: Date): string => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekDay = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
  return `${month}月${day}日（${weekDay}）`;
};

export const formatTime = (time?: string): string => {
  if (!time) return '';
  return time.slice(0, 5); // HH:MM形式
};