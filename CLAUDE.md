# Claude Code Configuration

## プロジェクト概要
**だんいんログ** - 白銀ノエルファン（団員）のための推し活記録アプリ（リニューアル中）
- コンセプト: 探索→記録→表現→成長のサイクル
- 詳細: docs/02-feature-exploration.md

## 技術スタック
- **フロントエンド**: Next.js (SSG) / TypeScript → Vercel
- **データ**: web/data/danin-log.db（SQLite）がコンテンツマスタデータ
- **イベント計測**: Next.js API Route → DynamoDB（AWS）
- **クライアント保存**: localStorage（推し活記録、ログイン不要）

## リポジトリ構成
```
shirogane-holy-knights/
├── web/                  # Next.js アプリ（本体）
├── tools/                # データ処理スクリプト（Python）
├── docs/                 # 設計ドキュメント
├── _legacy/              # 旧コード（参照用）
└── maintenance-site/     # メンテナンス中表示
```

## web/ ディレクトリ構成
```
web/src/
├── app/                  # App Router（ルーティング+ページ組み立てのみ）
│   ├── page.tsx          # トップ（δ型ハブ）
│   ├── streams/          # 配信
│   ├── music/            # 楽曲
│   ├── asmr/             # A1 今日のASMR
│   ├── report/           # B5 団員レポート
│   ├── footprint/        # B4a 団員のあしあと
│   └── api/
│       ├── og/           # OGP画像生成
│       └── events/       # イベント計測（DynamoDB書き込み）
├── features/             # 機能単位モジュール（components/, hooks/, lib/）
│   ├── streams/
│   ├── music/
│   ├── asmr-today/
│   ├── report/
│   ├── footprint/
│   └── home/
├── components/           # 共通UIコンポーネント
│   ├── ui/               # ボタン、カード等の部品
│   └── layout/           # ヘッダー、フッター
├── lib/                  # 共通ユーティリティ
│   ├── data/             # SQLite読み込み・型変換（ビルド時）
│   └── storage/          # localStorage抽象化
├── hooks/                # 共通カスタムフック
├── types/                # 共通型定義
└── styles/               # globals.css等
```

## 規約

### 技術スタック
- Next.js 15 (App Router, SSG) / React 19 / TypeScript (strict)
- Tailwind CSS v4
- pnpm
- Node.js 20+

### コーディング規約
- ファイル名: kebab-case（`stream-card.tsx`）
- コンポーネント名: PascalCase（`StreamCard`）
- パスエイリアス: `@/` → `src/`
- export: named export。default export は page.tsx / layout.tsx のみ
- Server/Client境界: デフォルト Server Component。ブラウザAPI使用時のみ `"use client"`
- Lint: ESLint flat config + eslint-config-next
- Format: Prettier（シングルクォート）

### 設計原則
- `app/` は薄く保つ。ロジック・UIは `features/` に閉じ込める
- 機能間の共有は `lib/`、`components/`、`hooks/`、`types/` 経由
- データ取得はビルド時にSQLite読み込み（better-sqlite3） → SSG
- クライアント状態は localStorage。`lib/storage/` で型安全なラッパーを共通化
