# Backend

だんいんポータル のバックエンドAPI

## 技術スタック

- **Framework**: Spring Boot 3.2 + Spring Cloud Function
- **Language**: Kotlin
- **Database**: PostgreSQL 14 (R2DBC)
- **Migration**: Liquibase
- **Build Tool**: Gradle (Kotlin DSL)
- **Runtime**: AWS Lambda (Spring Cloud Function)
- **API Gateway**: AWS API Gateway
- **Container**: Docker (開発環境)

## プロジェクト構成

```
backend/
├── src/
│   ├── main/
│   │   ├── kotlin/com/shirogane/holy/knights/
│   │   │   ├── adapter/          # コントローラ & リポジトリ実装
│   │   │   │   ├── controller/   # REST API エンドポイント
│   │   │   │   └── repository/   # R2DBC リポジトリ実装
│   │   │   ├── application/      # ユースケース & DTO
│   │   │   │   ├── dto/          # データ転送オブジェクト
│   │   │   │   └── usecase/      # ビジネスロジック
│   │   │   ├── domain/           # ドメインモデル & リポジトリインターフェース
│   │   │   │   ├── model/        # エンティティ
│   │   │   │   └── repository/   # リポジトリインターフェース
│   │   │   └── infrastructure/   # 設定 & Lambda ハンドラ
│   │   │       ├── config/       # Spring 設定
│   │   │       └── lambda/       # AWS Lambda ハンドラ
│   │   └── resources/
│   │       ├── application.yml   # Spring Boot 設定
│   │       ├── application-lambda.yml  # Lambda環境用設定
│   │       └── db/changelog/     # Liquibase マイグレーション
│   └── test/                     # テストコード
├── build.gradle.kts              # ビルド設定
└── Dockerfile                    # Docker設定（開発環境用）
```

## データベーススキーマ

**データベース関連の作業前に必ず `docs/database-schema.md` を参照してください**

## 開発環境

### ローカル起動

```bash
# バックエンドサービス起動 (http://localhost:8080)
docker compose up -d --build backend

# ログ確認
docker compose logs -f backend

# サービス停止
docker compose down
```

### データベース接続

```bash
# ローカルDB起動
docker compose up postgres -d

# マイグレーション実行
docker compose up liquibase

# DBコンソール接続
PGPASSWORD=postgres psql -h localhost -p 5432 -U postgres -d shirogane
```

### ビルド

```bash
# ビルド実行
./gradlew build

# Lambda用JARファイル生成
./gradlew bootJar
# → build/libs/shirogane-holy-knights-0.1.0-springboot-lambda.jar
```

### テスト

```bash
# TODO: テスト整備
```

## API

TODO: APIドキュメントを整備する
主要なAPIエンドポイント:

- `GET /health` - ヘルスチェック
- `POST /videos` - 動画一覧取得
- `POST /streams` - 配信一覧取得
- `POST /news` - ニュース一覧取得
- `GET /news/categories` - ニュースカテゴリ一覧取得

## Spring プロファイル

- **default**: ローカル開発環境（直接DB接続）
- **lambda**: AWS Lambda実行環境（RDS接続）

プロファイル切り替え:
```bash
# ローカル実行
SPRING_PROFILES_ACTIVE=default ./gradlew bootRun

# Lambda環境シミュレーション
SPRING_PROFILES_ACTIVE=lambda ./gradlew bootRun
```

## Lambda デプロイ

### GitHub Actions経由

```bash
# 開発環境デプロイ
gh workflow run temp-deploy-backend.yml --field environment=dev

# 本番環境デプロイ
gh workflow run temp-deploy-backend.yml --field environment=prd
```
