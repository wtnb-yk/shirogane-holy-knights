import { useEffect, useState, type RefObject } from 'react';

/** ResizeObserver でグリッドの実際の列数を取得する */
export function useGridColumns(
  gridRef: RefObject<HTMLDivElement | null>,
  fallback = 4,
): number {
  const [cols, setCols] = useState(fallback);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      const colCount =
        getComputedStyle(el).gridTemplateColumns.split(' ').length;
      setCols(colCount);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [gridRef]);

  return cols;
}
