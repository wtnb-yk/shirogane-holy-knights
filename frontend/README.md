# Frontend

だんいんポータル のフロントエンドアプリケーション

## 技術スタック

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + tailwindcss-animate
- **UI Components**: Radix UI + カスタムコンポーネント
- **Data Fetching**: SWR
- **HTTP Client**: Axios
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Utilities**: clsx, class-variance-authority, tailwind-merge
- **Deployment**: AWS Amplify

## 開発コマンド

### 基本コマンド

```bash
# 開発サーバー起動 (http://localhost:3001)
docker compose up -d --build frontend

# ログ確認
docker compose logs -f frontend

# 停止
docker compose down
```

## デプロイ

### 手動デプロイ

```bash
# GitHub Actions 経由でデプロイ
gh workflow run deploy-frontend.yml --field environment=dev
gh workflow run deploy-frontend.yml --field environment=prd
```

#### CloudFront URL の取得方法

```bash
# 本番環境
cd ../infrastructure/terraform/environments/prd
terraform output cdn_cloudfront_url

# 開発環境  
cd ../infrastructure/terraform/environments/dev
terraform output cdn_cloudfront_url
```

## 画像配信システム

### アーキテクチャ

```
Frontend → [API Gateway] → [Lambda] → [RDS]
    ↓
[S3 Bucket] → [CloudFront CDN] → [画像表示]
```

### 画像の扱い方

1. **画像アップロード** - AWS Consoleから手動でS3へアップロード
2. **表示** - `getImageUrl()` でCloudFront URLに変換

## プロジェクト構成

```
src/
├── app/                    # App Router
├── components/            # 共通UIコンポーネント
├── features/              # 機能別モジュール
│   ├── home/             # ホーム画面
│   ├── news/             # ニュース機能
│   └── videos/           # 動画機能  
├── lib/                   # ライブラリ設定
└── utils/                # 汎用ユーティリティ
```

## 主要機能

### ホーム画面（/）

- プロフィールセクション
- 統計情報表示
- ニュースプレビュー
- 動画アーカイブプレビュー
- YouTubeリンク

### ニュース（/news）

- ニュース記事一覧・詳細
- カテゴリー別フィルタ
- 検索・ページネーション
- レスポンシブレイアウト

### 動画（/videos）

- YouTube動画・配信一覧
- タグによるフィルタリング
- 検索・ページネーション

## デザインシステム

**UI/デザイン関連の作業前に必ず `docs/ui-design.md` を参照してください**

- コンポーネント設計指針
- 詳細なスタイルガイド
- レイアウトパターン
- アクセシビリティ要件
