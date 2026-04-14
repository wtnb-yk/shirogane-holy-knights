# Frontend

だんいんポータル のフロントエンドアプリケーション

## 技術スタック

- **Runtime**: Node.js 20 LTS
- **Package Manager**: pnpm 8+
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

### アーカイブ（/archives）

- YouTube動画・配信アーカイブ一覧
- コンテンツタイプ切り替え（配信/動画）
- タグ・日付によるフィルタリング
- 検索・ページネーション
- レスポンシブレイアウト

### 楽曲（/songs）

- 歌枠楽曲データベース
- 楽曲名・アーティスト検索
- 歌唱回数・日付ソート
- グリッド/リスト表示切り替え
- レスポンシブレイアウト

## レスポンシブ対応

全画面（ホーム画面除く）でレスポンシブデザインを採用：

### ブレークポイント
- **スマホ**: 640px未満 (`sm:hidden` / `sm:block`)  
- **タブレット**: 640px以上1024px未満 (`hidden sm:block lg:hidden`)
- **デスクトップ**: 1024px以上 (`hidden lg:block`)

### 各画面の対応
- **スマホサイズ**: タイトル下の説明文を非表示、検索・絞り込みボタンをタイトル下に配置
- **タブレット以上**: 説明文を表示し、ボタンは説明文の右側に配置
- **デスクトップ**: フルサイドバーを表示

## デザインシステム

**UI/デザイン関連の作業前に必ず `docs/ui-design.md` を参照してください**

- コンポーネント設計指針
- 詳細なスタイルガイド
- レイアウトパターン
- アクセシビリティ要件
