export enum NewsCategory {
  GOODS = 'goods',
  COLLABORATION = 'collaboration',
  EVENT = 'event',
  CAMPAIGN = 'campaign',
  OTHERS = 'others'
}

export const CATEGORY_DISPLAY_NAMES: Record<NewsCategory, string> = {
  [NewsCategory.GOODS]: 'グッズ',
  [NewsCategory.COLLABORATION]: 'コラボ',
  [NewsCategory.EVENT]: 'イベント',
  [NewsCategory.CAMPAIGN]: 'キャンペーン',
  [NewsCategory.OTHERS]: 'その他'
};

export const getCategoryDisplayName = (categoryName: string): string => {
  const category = Object.values(NewsCategory).find(v => v === categoryName.toLowerCase());
  return category ? CATEGORY_DISPLAY_NAMES[category as NewsCategory] : categoryName;
};