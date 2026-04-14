import { SpecialItemConfig, SpecialGridLayout } from '../types/specialGridTypes';

/**
 * より正確なスキップインデックス計算
 */
function calculateSkipIndicesAccurate(
  specialItems: SpecialItemConfig[]
): number[] {
  const skipIndices: number[] = [];
  
  // 特別アイテムをデータインデックス順にソート
  const sortedSpecialItems = [...specialItems].sort((a, b) => a.dataIndex - b.dataIndex);
  
  sortedSpecialItems.forEach(item => {
    const { colSpan, rowSpan } = item.gridPlacement;
    
    // 2x2の場合の追加占有計算
    if (colSpan === 2 && rowSpan === 2) {
      // 特別アイテムが位置Nにある場合
      // N+1（右隣）、N+colSize（下）、N+colSize+1（右下）をスキップ
      const nextIndex = item.dataIndex + 1;
      
      // 既に追加済みでない場合のみ追加
      if (!skipIndices.includes(nextIndex)) {
        skipIndices.push(nextIndex);
      }
    }
  });
  
  return skipIndices.sort((a, b) => a - b);
}

/**
 * 特別レイアウト設定から完全な設定を生成
 */
export function createSpecialGridLayout(
  specialItems: SpecialItemConfig[]
): SpecialGridLayout {
  const skipIndices = calculateSkipIndicesAccurate(specialItems);
  
  return {
    specialItems,
    skipIndices
  };
}

/**
 * グリッドレスポンシブクラス名を生成
 */
export function generateGridClassName(columns: {
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}): string {
  const classNames: string[] = ['grid'];

  // smは最小幅から適用するのでプレフィックスなし
  if (columns.sm) classNames.push(`grid-cols-${columns.sm}`);
  if (columns.md) classNames.push(`md:grid-cols-${columns.md}`);
  if (columns.lg) classNames.push(`lg:grid-cols-${columns.lg}`);
  if (columns.xl) classNames.push(`xl:grid-cols-${columns.xl}`);

  return classNames.join(' ');
}

/**
 * アイテムが特別アイテムかどうかを判定
 */
export function isSpecialItem(
  index: number,
  specialItems: SpecialItemConfig[]
): SpecialItemConfig | undefined {
  return specialItems.find(item => item.dataIndex === index);
}

/**
 * アイテムをスキップすべきかどうかを判定
 */
export function shouldSkipItem(
  index: number,
  skipIndices: number[]
): boolean {
  return skipIndices.includes(index);
}
