# Infrastructure

## 概要

だんいんポータル のインフラストラクチャ管理

## テクノロジースタック

- **IaC**: Terraform
- **クラウドプロバイダー**: AWS
- **主要サービス**:
  - Lambda (Spring Boot アプリケーション)
  - API Gateway
  - RDS (PostgreSQL 14)
  - Amplify (フロントエンド)
  - CloudFront (CDN)
  - S3 (静的ファイル)

## システムアーキテクチャ

```
Frontend (Next.js) → API Gateway → Lambda (Spring Boot) → RDS (PostgreSQL)
                                                      ↓
                              CloudFront (CDN) ← S3 (Static files)
```

## ディレクトリ構成

```
infrastructure/
├── terraform/
│   ├── bootstrap/         # Terraform Backend用リソース管理
│   ├── environments/      # 環境別設定
│   │   ├── dev/           # 開発環境
│   │   └── prd/           # 本番環境
│   └── modules/           # 再利用可能なTerraformモジュール
├── scripts/               # インフラ管理用スクリプト
└── README.md
```

## 初期セットアップ（プロジェクト開始時のみ）

Terraformのremote state管理に必要なAWSリソースを作成する必要があります。

### 方法1: スクリプトを使用
```bash
cd infrastructure
./scripts/bootstrap-terraform.sh
```

### 方法2: 手動実行
```bash
cd infrastructure/terraform/bootstrap
terraform init
terraform plan
terraform apply
```

詳細は `terraform/bootstrap/README.md` を参照してください。

## インフラ操作

### Terraform操作（インフラ構築・更新）

```bash
# 開発環境のプラン確認
gh workflow run terraform.yml --field environment=dev --field action=plan

# 開発環境への適用
gh workflow run terraform.yml --field environment=dev --field action=apply

# 本番環境のプラン確認
gh workflow run terraform.yml --field environment=prd --field action=plan

# 本番環境への適用
gh workflow run terraform.yml --field environment=prd --field action=apply
```

### ワークフロー実行状況確認

```bash
# Terraformワークフローの一覧
gh run list --workflow=terraform.yml

# バックエンドデプロイワークフローの一覧
gh run list --workflow=deploy-backend.yml

# フロントエンドデプロイワークフローの一覧
gh run list --workflow=deploy-frontend.yml
```
