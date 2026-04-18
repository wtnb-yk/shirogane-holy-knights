。# アーキテクチャルール

## レイヤー構成

```
app/           → ルーティング + ページ組み立て（薄く保つ）
features/      → 機能単位モジュール（components/, hooks/, lib/）
components/    → 共通UIコンポーネント
  ui/          → ボタン、カード等の部品
  layout/      → ヘッダー、フッター
lib/           → 共通ユーティリティ
  data/        → CSV読み込み・型変換（ビルド時）
  storage/     → localStorage抽象化
hooks/         → 共通カスタムフック
types/         → 共通型定義
styles/        → globals.css等
```

## Server / Client 境界

- デフォルト Server Component。ブラウザAPI（useState, useEffect, localStorage等）使用時のみ `"use client"`
- ヘッダー・フッター等のレイアウトは Server Component
- ナビのドロップダウン開閉は CSS（:hover / :focus-within）で実装し JS を避ける

## データフロー

- コンテンツデータ: ビルド時に tools/data/ の CSV を lib/data/ で読み込み → SSG
- クライアント状態: localStorage。lib/storage/ で型安全なラッパーを共通化
- tools/data/ と web/data/ は gitignore 済み。本番データは S3 管理

## export ルール

- named export が基本
- default export は page.tsx / layout.tsx のみ

## デザイントークン

globals.css で2層構造のトークンを定義。プロトタイプ（docs/home-prototype.html）が正。

### 構造

| 層 | 定義場所 | 用途 |
|---|---|---|
| パレット | `@theme` | 生の色値。**コンポーネントでの直接使用は禁止** |
| セマンティック | `@theme`（非 inline） | 目的別トークン。コンポーネントで使う |
| タイポグラフィ | `@theme` | フォントサイズ・レタースペーシング |
| スペーシング | `@theme inline` | 余白スケール |
| 角丸 | `@theme inline` | コンポーネント種別ごとの丸み |
| レイアウト定数 | `:root` | 構造的な寸法（`var()` で参照） |

### 重要ルール

- コンポーネントではパレット色（`navy-600`, `cream-300` 等）を**絶対に使わない**。セマンティックトークンを使う
- arbitrary value（`[10px]`, `[3px]` 等）も使わない。トークン（`text-3xs`, `gap-2xs`, `rounded-xs` 等）を使う
- 必要なトークンがなければ globals.css に追加する
- PostToolUse フック（`.claude/scripts/check-component.sh`）がパレット直接参照を自動検出する

### セマンティック色（コンポーネントで使うのはこちら）

| カテゴリ | トークン | 用途 |
|---|---|---|
| Background | `page` / `surface` / `surface-hover` | ページ背景 / カード面 / ホバー面 |
| Text | `heading` / `foreground` / `secondary` / `muted` / `subtle` / `faint` | 見出し / 本文 / カード説明 / 補助 / メタ / フッター |
| Text (装飾) | `decorative` / `decorative-muted` | アイコン / 非公式表記 |
| Border | `border` / `border-hover` / `border-strong` | 標準 / ホバー / 強調ホバー |
| Accent | `accent` / `accent-label` | 装飾線 / セクションラベル |
| Header | `header-bg` / `header-text` / `header-border` | ヘッダー専用 |
| Interactive | `interactive` / `link-hover` | 操作要素のデフォルト / ホバー |

### タイポグラフィトークン

| トークン | 値 | 用途 |
|---|---|---|
| `text-3xs` | 10px | モノタイプメタ情報、バッジ |
| `text-2xs` | 11px | チェックボタン、タグピル、入力欄 |
| `tracking-tight` | -0.01em | タイトル |
| `tracking-normal` | 0.02em | ボタン、ロゴ |
| `tracking-wide` | 0.1em | セクションタイトル（UPPERCASE） |
| `tracking-wider` | 0.14em | ラベル（UPPERCASE） |

### レイアウト定数（`:root` で定義、`var()` で参照）

```
--content-max: 1120px          コンテンツ最大幅
--header-height: 3.5rem        ヘッダー高さ
--dropdown-width: 280px        ドロップダウン幅
--hub-card-min-h: 140px        ハブカード最小高さ
--filter-panel-width: 360px    フィルタパネル幅
--filter-panel-max-h: 420px    フィルタパネル最大高
--search-expanded-width: 200px 展開式検索幅
```

使用例: `max-w-[var(--content-max)]`（`[--name]` ショートハンドは寸法に効かないため `var()` 必須）

### シャドウ（`shadow-*` ユーティリティで使用）

- `shadow-card` / `shadow-card-hover` — カード標準 / ホバー
- `shadow-dropdown` — ドロップダウン
- `shadow-button-hover` — ボタンホバー

### スペーシング（8段スケール）

```
2xs(3)  タグ間微小ギャップ    xs(4)   微小ギャップ
sm(8)   小パディング          md(16)  カードグリッド gap
lg(24)  カード padding        xl(40)  セクション内大間隔
2xl(64) セクション上下 padding  3xl(120) ページ主要セクション間
```

### 角丸（コンポーネント種別ごと）

- `rounded-xs`(3px) — 小タグ、バッジ
- `rounded-sm`(6px) — ボタン、ピル、タグ
- `rounded-md`(10px) — ドロップダウン、パネル
- `rounded-lg`(16px) — カード、主要コンテナ

### フォント

- display（Outfit）: 見出し・カード名
- body（M PLUS 2）: 本文・UI・ロゴ
- mono（JetBrains Mono）: 日付・メタ情報・ラベル

### フォントサイズ（プロトタイプ準拠に上書き済み）

xl以上は Tailwind デフォルトより大きい: xl(1.5rem) / 2xl(2rem) / 3xl(2.5rem) / 4xl(3.5rem)

## コンポーネント設計方針

- プロトタイプの CSS クラス名・構造を Tailwind ユーティリティクラスに変換して実装
- プロトタイプの視覚的な仕上がりを忠実に再現する
- アニメーション: reveal（スクロールトリガー）、stagger（子要素時差）はプロトタイプ準拠
- レスポンシブ: Tailwind 標準ブレークポイント（md=768px）を使用。プロトタイプは860pxだが統一性を優先して変更（2026-04-17決定）

## コンポーネント分割規約

### 責務による分割
- 1コンポーネント = 1責務。「表示」と「ロジック」が混在したら分離を検討
- 分割の判断基準:
  - 異なる更新頻度を持つ部分がある（例: 静的ヘッダー vs 動的カウンター）
  - 独立して再利用できる塊がある（例: カード、リストアイテム）
  - Server/Client境界をまたぐ（Client部分を最小のコンポーネントに切り出す）

### 行数目安
- 1コンポーネント: 150行以下を目安。超えたら分割を検討
- JSX（return内）: 50行以下を目安。超えたら子コンポーネント抽出を検討

### 分割しなくてよい場合
- 行数が多くても単一の責務で一連の流れなら無理に分割しない
- 1箇所でしか使わない小さな表示ブロックを過度に切り出さない

## ページ構成（トップページ）

1. カバー（コンパクト）: アイコン + タイトル + タグライン + 非公式表記
2. Today（最新配信 + スケジュール）: 後続タスク
3. My Log（視聴記録）: 後続タスク
4. Bento Grid（機能一覧）: 「探す」3カード + 「作る」2カード

## ナビ構造

2グループ構成（v1.0）:
- 探す: 配信一覧(/streams) / 楽曲ライブラリ(/music) / 今日のASMR(/asmr)
- 共有する: 団員レポート(/report) / 団員のあしあと(/footprint)
