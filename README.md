# shirogane-holy-knights

白銀ノエル団員ポータル - ファン向け配信アーカイブ検索・閲覧サービス

> **現在リニューアル作業中です。** 本番サイト (noe-room.com) はメンテナンスページを表示しています。

## 新技術スタック（予定）

| 層 | 技術 | ホスティング |
|---|---|---|
| フロントエンド | Next.js (SSG) / TypeScript | Vercel |
| バックエンド | Go | Fly.io |
| データ | CSV (tools/) | - |

## ディレクトリ構成

```
├── tools/              # コンテンツデータ管理（CSV、変換スクリプト）
├── maintenance-site/   # 本番メンテナンスページ（稼働中）
└── _legacy/            # 旧コード（参照用に保持）
    ├── frontend/       #   旧 Next.js フロントエンド
    ├── backend/        #   旧 Kotlin/Spring Boot バックエンド
    ├── infrastructure/ #   旧 Terraform IaCコード
    └── ...
```

## 旧構成について

旧構成のコード・設定は `_legacy/` ディレクトリに保持しています。
参照が必要な場合はそちらを確認してください。
