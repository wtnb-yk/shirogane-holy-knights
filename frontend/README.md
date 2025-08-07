# フロントエンド

Next.js App Router を使用したフロントエンドアプリケーション

## 技術スタック

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Deployment**: AWS Amplify

## 環境変数

`.env.local.example` をコピーして `.env.local` を作成し、以下の環境変数を設定してください：

```bash
cp .env.local.example .env.local
```

### 必須環境変数

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `NEXT_PUBLIC_API_URL` | バックエンドAPIのURL | `http://localhost:8080` |
| `NEXT_PUBLIC_CDN_URL` | CloudFront CDNのURL | `https://d123456789.cloudfront.net` |

### CloudFront URL の取得方法

```bash
# Terraform でdev環境構築後
cd ../infrastructure/terraform/environments/dev
terraform output cdn_cloudfront_url
```

## 画像配信システム

### アーキテクチャ

```
[S3 Bucket] → [CloudFront CDN] → [Next.js App]
```

- **S3**: 画像ファイルの保存先
- **CloudFront**: グローバルCDNによる高速配信
- **画像URL管理**: `src/utils/imageUrl.ts` で相対パスからCDN URLを生成

### 画像の扱い方

#### 1. 画像アップロード（手動）

AWS Console から S3 バケットに画像をアップロード：

```
バケット名: shirogane-holy-knights-images-dev
フォルダ構造: /news/2025/01/example.jpg
```

#### 2. データベースへの登録

相対パスで保存（CloudFront URLは自動生成）：

```sql
INSERT INTO news (thumbnail_url, ...) 
VALUES ('news/2025/01/example.jpg', ...);
```

#### 3. フロントエンドでの表示

```tsx
import { getImageUrl } from '@/utils/imageUrl';

// DBから取得した相対パス
const thumbnailPath = 'news/2025/01/example.jpg';

// CloudFront URLに変換
const imageUrl = getImageUrl(thumbnailPath);
// → https://d123456789.cloudfront.net/news/2025/01/example.jpg
```

### ローカル開発での画像表示

ローカル環境では dev 環境の CloudFront を参照します：

1. dev環境の CloudFront URL を取得（上記参照）
2. `.env.local` に設定
3. dev環境のS3に画像をアップロード
4. ローカルでも実際の画像が表示される

## 開発コマンド

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm run start

# 型チェック
npm run type-check

# リント
npm run lint
```

## ディレクトリ構成

```
src/
├── app/                # App Router ページ
├── components/        # 共通UIコンポーネント
├── features/          # 機能別モジュール
│   ├── videos/       # 動画関連
│   └── news/         # ニュース関連
├── hooks/            # カスタムフック
├── lib/              # ライブラリ設定
├── styles/           # グローバルスタイル
└── utils/            # ユーティリティ関数
    └── imageUrl.ts   # 画像URL管理
```

## デザインシステム

**UI/デザイン関連の作業前に必ず `docs/ui-design.md` を参照してください**

- コンポーネント設計指針
- 詳細なスタイルガイド  
- レイアウトパターン
- アクセシビリティ要件