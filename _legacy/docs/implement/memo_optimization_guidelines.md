# React.memo化 開発ガイドライン

## 概要
本ガイドラインは、プロジェクト内でのReact.memoの適切な使用方針を定めるものです。

## memo化の基本原則

### memo化すべきコンポーネント

#### 1. リストアイテムコンポーネント
```typescript
// ✅ 推奨：大量のデータを扱うリストアイテム
export const VideoCard = React.memo(({ video, index }: VideoCardProps) => {
  // コンポーネント実装
});
```

**理由**: 大量のデータを扱うリストで、個々のアイテムの不要な再レンダリングを防ぐため

#### 2. 重い処理を含むコンポーネント
```typescript
// ✅ 推奨：画像最適化など重い処理を含む
export const OptimizedImage = React.memo(({ src, alt, ...props }: ImageProps) => {
  // 重い画像処理
});
```

**理由**: 計算コストの高い処理の不要な実行を防ぐため

#### 3. 子要素が多いグリッドコンポーネント
```typescript
// ✅ 推奨：多くの子要素を持つグリッド
export const BaseGrid = React.memo(BaseGridComponent) as <T>(props: BaseGridProps<T>) => React.ReactElement;
```

**理由**: 子要素の再レンダリングを最小限に抑えるため

#### 4. スケルトンコンポーネント
```typescript
// ✅ 推奨：静的なスケルトンUI
export const SkeletonCard = React.memo(({ index }: SkeletonCardProps) => {
  // スケルトンUI
});
```

**理由**: プロップスがほとんど変わらない静的コンテンツのため

### memo化不要なコンポーネント

#### 1. 軽量なUIコンポーネント
```typescript
// ❌ 不要：軽量なボタンコンポーネント
export const Button = ({ variant, children, ...props }: ButtonProps) => {
  return <button className={getButtonClasses(variant)} {...props}>{children}</button>;
};
```

**理由**: memo化のオーバーヘッドの方が大きい可能性があるため

#### 2. 状態変更が頻繁なコンポーネント
```typescript
// ❌ 不要：状態変更が頻繁なHeroSection
export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // 頻繁な状態更新
}
```

**理由**: プロップスや状態が頻繁に変わるためmemo化の効果が薄いため

#### 3. プロップスが頻繁に変わるコンポーネント
```typescript
// ❌ 不要：プロップスが頻繁に変わるCalendar
export function Calendar({ currentDate, events, onDateChange }: CalendarProps) {
  // プロップスが頻繁に変更される
}
```

**理由**: プロップスの変更が頻繁なためmemo化の効果が期待できないため

## 実装のベストプラクティス

### 1. コンポーネントの命名
```typescript
// 実装コンポーネントとエクスポート用を分離
const VideoCardComponent = ({ video, index }: VideoCardProps) => {
  // 実装
};

VideoCardComponent.displayName = 'VideoCard';

export const VideoCard = React.memo(VideoCardComponent);
```

### 2. useMemoとuseCallbackの併用
```typescript
const VideosGridComponent = ({ videos, loading, error }: VideosGridProps) => {
  // Memoize render functions to prevent unnecessary re-renders
  const renderItem = useCallback((video: VideoDto, index: number) => (
    <VideoCard key={video.id} video={video} index={index} />
  ), []);

  const renderSkeleton = useCallback((index: number) => (
    <SkeletonCard key={index} index={index} />
  ), []);

  // Memoize grid configuration
  const gridConfig = useMemo(() => {
    const gridColumns = getVideoGridColumns();
    const gridClassName = generateGridClassName(gridColumns);
    return { columns: gridColumns, className: gridClassName };
  }, []);

  return (
    <BaseGrid
      items={videos}
      renderItem={renderItem}
      renderSkeleton={renderSkeleton}
      gridClassName={gridConfig.className}
    />
  );
};

export const VideosGrid = React.memo(VideosGridComponent);
```

### 3. 型安全なmemo化（ジェネリック）
```typescript
function BaseGridComponent<T>({ items, renderItem }: BaseGridProps<T>) {
  // 実装
}

export const BaseGrid = React.memo(BaseGridComponent) as <T>(props: BaseGridProps<T>) => React.ReactElement;
```

## パフォーマンス測定

### React Developer Toolsでの確認
1. Profilerタブでコンポーネントの再レンダリング頻度を確認
2. なぜ再レンダリングされたかの理由を確認
3. memo化前後でのパフォーマンス比較

### 測定すべき指標
- レンダリング時間
- 再レンダリング頻度
- メモリ使用量
- バンドルサイズへの影響

## 注意事項

### 1. memo化のオーバーヘッド
- プロップスの比較処理自体にもコストがかかる
- 軽量なコンポーネントでは逆効果になる場合がある

### 2. 依存配列の管理
- useMemoやuseCallbackの依存配列を適切に設定する
- 不要な依存関係を含めない

### 3. 開発時の確認
- React Developer Toolsで実際の効果を測定する
- プロファイリングを定期的に実行する

## まとめ
memo化は適切に使用すればパフォーマンス向上に効果的ですが、すべてのコンポーネントに適用すべきではありません。このガイドラインを参考に、各コンポーネントの特性を考慮して判断してください。