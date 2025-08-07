# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

だんいんポータル - 白銀ノエルファン向けサービス

### Architecture

この既存のプロジェクトは以下の技術スタックを使用しています：
- **Backend**: 
  - ローカル開発: Kotlin + Spring Boot 3.2 (WebFlux) + R2DBC (PostgreSQL)
  - 本番環境: 同上 + Spring Cloud Function + AWS Lambda
- **Frontend**: Next.js + TypeScript + SWR + TailwindCSS
- **Database**: PostgreSQL 14 (Liquibase マイグレーション)
- **Infrastructure**: AWS (Lambda, API Gateway, RDS, Amplify, CloudFront) + Terraform
- **Build Tools**: Gradle (Kotlin), npm

### System Architecture

```
Frontend (Next.js) → API Gateway → Lambda (Spring Boot) → RDS (PostgreSQL)
                                                      ↓
                              CloudFront (CDN) ← S3 (静的ファイル)
```

## Essential Commands

### Backend Development

```bash
# バックエンド起動 (http://localhost:8080)
docker compose up -d --build backend

# テスト実行
# TODO: テストの整備
```

### Frontend Development

```bash
# フロントエンド起動 (http://localhost:3001)
docker compose up -d --build frontend

# リント実行
# TODO: リントの整備
```

### Local Environment Setup

```bash
# PostgreSQL + 全サービス起動
docker-compose up -d

# データベース単体起動
docker-compose up postgres -d

# マイグレーション実行
docker-compose up liquibase
```

### Data Import Tools

```bash
# YouTubeデータ取得・DB同期 
cd tools && make sync-{local|dev|prd}

# ニュースデータインポート  
cd tools && make news-import-{local|dev|prd}

# データベース接続
cd tools && make db-{dev|prd}

# データベース切断
cd tools && make db-{dev|prd}-stop

# データベース接続状態
cd tools && make db-{dev|prd}-status
```

### Infrastructure Operations

```bash
# Terraform操作 (インフラ構築・更新)
gh workflow run terraform.yml --field environment=dev --field action=plan
gh workflow run terraform.yml --field environment=dev --field action=apply
gh workflow run terraform.yml --field environment=prd --field action=plan
gh workflow run terraform.yml --field environment=prd --field action=apply

# Backend デプロイ (Lambda関数更新)
gh workflow run temp-deploy-bacnend.yml --field environment=dev
gh workflow run temp-deploy-bacnend.yml --field environment=prd

# ワークフロー実行状況確認
gh run list --workflow=terraform.yml
gh run list --workflow=deploy-backend.yml

# 実行中のワークフロー詳細確認
gh run view --workflow=terraform.yml
```

## Important Project Structure

### Backend (Kotlin/Spring Boot)
- `src/main/kotlin/com/shirogane/holy/knights/`
  - `adapter/` - Controllers & Repository implementations
  - `application/` - Use cases & DTOs  
  - `domain/` - Domain models & repository interfaces
  - `infrastructure/` - Configuration & Lambda handlers
- `src/main/resources/db/changelog/` - Liquibase migrations

### Frontend (Next.js)
- `src/app/` - App Router pages
- `src/components/` - Reusable UI components
- `src/features/` - Feature-specific components & hooks

### Infrastructure  
- `infrastructure/terraform/environments/` - Environment-specific configs
- `infrastructure/terraform/modules/` - Reusable Terraform modules

## Development Notes

### Database Connection
- Local: `localhost:5432/shirogane` (postgres/postgres)
- Dev: Bastion経由でRDS接続 (`make db-dev`)
- Prd: Bastion経由でRDS接続 (`make db-prd`)

### Spring Profiles
- `default` - ローカル開発用 (直接DB接続)
- `lambda` - AWS Lambda実行環境用

### CORS Configuration
- Dev環境: `dev.noe-room.com` + Amplify preview URLs
- Prd環境: `www.noe-room.com`

### Performance Considerations
- Lambda Cold Start対策として1024MB/60秒設定済み
- R2DBC (非同期DB接続) 使用でスループット最適化
- CloudFront CDN経由で静的ファイル配信

