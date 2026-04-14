# フロントエンドパフォーマンス最適化ガイド

## 概要

このドキュメントでは、だんいんポータルのフロントエンドパフォーマンス最適化について説明します。

## 実装済み最適化

### 1. バンドルサイズ最適化

#### コード分割
- **動的インポート**: 重いコンポーネントを動的にロード
- **チャンク分割**: vendor、UI、features別にバンドルを分割
- **ルートレベル分割**: ページごとの自動コード分割

#### 設定ファイル
```javascript
// next.config.js
experimental: {
  optimizePackageImports: [
    'lucide-react',
    'framer-motion',
    '@radix-ui/react-tooltip'
  ],
}
```

### 2. 画像最適化

#### OptimizedImage コンポーネント
- **遅延読み込み**: Intersection Observer API使用
- **プレースホルダー**: blur効果付きプレースホルダー
- **レスポンシブ**: デバイスサイズに応じた画像配信
- **フォーマット最適化**: WebP/AVIF対応

```typescript
<OptimizedImage
  src={imageUrl}
  alt="説明"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  priority={false}
/>
```

### 3. レンダリング最適化

#### メモ化
- **React.memo**: コンポーネントの不要な再レンダリング防止
- **useMemo**: 重い計算のキャッシュ
- **useCallback**: 関数の再作成防止

#### パフォーマンス監視
```typescript
const { startMeasurement, endMeasurement } = usePerformanceMonitor({
  componentName: 'VideoGrid',
  threshold: 16 // 60fps threshold
});
```

### 4. 検索最適化

#### デバウンス機能
- **検索クエリ**: 300ms のデバウンス
- **フィルタリング**: 不要なAPI呼び出し削減
- **ローディング状態**: ユーザーフィードバック改善

```typescript
const { debouncedSearchQuery, isSearching } = useVideoSearch(300);
```

### 5. 不要なコード削除

#### 削除済み
- **framer-motion**: 未使用のアニメーションライブラリ
- **dialog.tsx**: 未使用のUIコンポーネント
- **OverlayIcon.tsx**: 未使用のアイコンコンポーネント

## パフォーマンス分析ツール

### バンドル分析
```bash
# 詳細なバンドル分析（@next/bundle-analyzerが必要）
pnpm add -D @next/bundle-analyzer
pnpm analyze

# 簡易バンドル分析（依存関係不要）
pnpm bundle-analysis
```

**注意**: Docker環境では`@next/bundle-analyzer`がインストールされていない場合があります。その場合は以下のコマンドでインストールしてください：
```bash
pnpm add -D @next/bundle-analyzer
```

### パフォーマンス監視
開発環境では自動的にパフォーマンス監視が有効になります：
- 16ms以上のレンダリングを警告
- 100ms以上のマウント時間を警告
- 10回ごとに平均レンダリング時間を表示

## ベストプラクティス

### 1. コンポーネント設計
```typescript
// ✅ Good: メモ化されたコンポーネント
const VideoCard = React.memo(({ video, index }) => {
  // コンポーネント実装
});

// ❌ Bad: メモ化されていないコンポーネント
const VideoCard = ({ video, index }) => {
  // コンポーネント実装
};
```

### 2. 重い計算のメモ化
```typescript
// ✅ Good: 重い計算をメモ化
const expensiveValue = useMemo(() => {
  return heavyComputation(data);
}, [data]);

// ❌ Bad: 毎回計算
const expensiveValue = heavyComputation(data);
```

### 3. 動的インポート
```typescript
// ✅ Good: 重いコンポーネントを動的インポート
const HeavyModal = dynamic(() => import('./HeavyModal'), {
  loading: () => <Skeleton />,
  ssr: false
});

// ❌ Bad: 静的インポート
import HeavyModal from './HeavyModal';
```

### 4. 画像最適化
```typescript
// ✅ Good: 最適化された画像
<OptimizedImage
  src={src}
  alt={alt}
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  priority={isAboveFold}
/>

// ❌ Bad: 最適化されていない画像
<img src={src} alt={alt} />
```

## パフォーマンス目標

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5秒
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### カスタム指標
- **初回ページロード**: < 3秒
- **検索レスポンス**: < 2秒
- **ページ遷移**: < 1秒

## 監視とデバッグ

### 開発環境
```bash
# パフォーマンス監視付きで開発サーバー起動
pnpm dev
```

### 本番環境
- Google Analytics でCore Web Vitals監視
- Lighthouse CI でパフォーマンススコア監視

## 今後の最適化予定

1. **Service Worker**: オフライン対応とキャッシュ戦略
2. **Prefetching**: ユーザーの行動予測に基づくプリフェッチ
3. **Virtual Scrolling**: 大量データの効率的な表示
4. **Web Workers**: 重い処理のバックグラウンド実行

## トラブルシューティング

### よくある問題

#### 1. バンドルサイズが大きい
```bash
# バンドル分析を実行
pnpm analyze
# 大きなチャンクを特定し、動的インポートを検討
```

#### 2. レンダリングが遅い
```typescript
// パフォーマンス監視を有効にして原因を特定
const monitor = usePerformanceMonitor({
  componentName: 'SlowComponent',
  threshold: 16
});
```

#### 3. 画像読み込みが遅い
- `OptimizedImage` コンポーネントの使用を確認
- `sizes` プロパティの適切な設定を確認
- CDN設定の確認

## 参考資料

- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Web Vitals](https://web.dev/vitals/)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)