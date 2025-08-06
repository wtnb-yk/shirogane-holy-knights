# shirogane-holy-knights

白銀ノエル団員ポータル - ファン向け配信アーカイブ検索・閲覧サービス

## プロジェクト構成

```
├── frontend/          # Next.js フロントエンド
├── backend/           # Kotlin/Spring Boot バックエンド
├── infrastructure/    # Terraform IaCコード
└── docs/             # ドキュメント
```

## ローカル環境セットアップ

### 前提条件
- Node.js 18+
- Java 17+
- Docker Desktop
- AWS CLI
- Terraform

### 1. インフラ構築（初回のみ）

```bash
# dev環境のAWSリソースをデプロイ
cd infrastructure/terraform/environments/dev
terraform init
terraform apply

# CloudFront URL を取得（画像配信用）
terraform output cdn_cloudfront_url
```

### 2. 環境変数設定

```bash
# フロントエンド環境変数
cd frontend
cp .env.local.example .env.local

# .env.local を編集
# NEXT_PUBLIC_CDN_URL に上記で取得したCloudFront URLを設定
```

### 3. データベース起動

```bash
# PostgreSQLをDockerで起動
docker-compose up -d
```

### 4. バックエンド起動

```bash
cd backend
./gradlew bootRun
# http://localhost:8080 で起動
```

### 5. フロントエンド起動

```bash
cd frontend
npm install
npm run dev
# http://localhost:3000 で起動
```


## 開発ガイドライン

- フロントエンド: [frontend/README.md](frontend/README.md)
- バックエンド: [backend/README.md](backend/README.md)
- インフラ: [infrastructure/README.md](infrastructure/README.md)