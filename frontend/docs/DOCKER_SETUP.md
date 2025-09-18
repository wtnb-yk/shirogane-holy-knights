# Docker環境でのフロントエンド設定

## 問題の解決

### Bundle Analyzerエラーの修正

Docker環境で`@next/bundle-analyzer`が見つからないエラーが発生していました：

```
Error: Cannot find module '@next/bundle-analyzer'
```

### 解決方法

`next.config.js`を修正して、bundle analyzerの読み込みを条件付きにしました：

```javascript
// Conditionally load bundle analyzer only when needed
let withBundleAnalyzer = (config) => config;
try {
  if (process.env.ANALYZE === 'true') {
    withBundleAnalyzer = require('@next/bundle-analyzer')({
      enabled: true,
    });
  }
} catch (error) {
  console.warn('Bundle analyzer not available. Install @next/bundle-analyzer to use bundle analysis.');
}
```

## Docker環境での使用方法

### 1. 基本的な開発

```bash
# 通常の開発サーバー起動（bundle analyzerなし）
pnpm dev
```

### 2. パフォーマンス分析

```bash
# 簡易バンドル分析（依存関係不要）
pnpm bundle-analysis

# 詳細バンドル分析（bundle analyzerが必要）
pnpm analyze:install
```

### 3. ヘルスチェック

```bash
# パフォーマンス最適化の確認
pnpm health-check
```

## 利用可能なスクリプト

| スクリプト | 説明 | 依存関係 |
|-----------|------|----------|
| `pnpm dev` | 開発サーバー起動 | なし |
| `pnpm build` | プロダクションビルド | なし |
| `pnpm bundle-analysis` | 簡易バンドル分析 | なし |
| `pnpm analyze:install` | bundle analyzerインストール + 詳細分析 | @next/bundle-analyzer |
| `pnpm health-check` | パフォーマンス最適化確認 | なし |

## トラブルシューティング

### Bundle Analyzerが必要な場合

```bash
# Docker内でbundle analyzerをインストール
pnpm add -D @next/bundle-analyzer

# その後、詳細分析を実行
pnpm analyze
```

### 設定の確認

```bash
# Next.js設定が正しく読み込まれるかテスト
node -e "require('./next.config.js'); console.log('✅ OK');"

# パフォーマンス最適化の確認
pnpm health-check
```

## パフォーマンス最適化の確認

以下の最適化が適用されています：

- ✅ バンドル分割（vendor、UI、features）
- ✅ 画像最適化（WebP/AVIF対応）
- ✅ パッケージインポート最適化
- ✅ 動的インポート対応
- ✅ メモ化とレンダリング最適化

詳細は `docs/PERFORMANCE.md` を参照してください。