# Terraform Infrastructure for 団員ポータル

このディレクトリには、団員ポータルのAWSインフラストラクチャをTerraformで管理するためのコードが含まれています。

## ディレクトリ構造

```
terraform/
├── backend.tf          # Terraform state管理設定
├── versions.tf         # Terraformバージョン制約
├── modules/            # 再利用可能なモジュール
│   ├── network/        # VPC、サブネット、セキュリティグループ
│   ├── database/       # RDS PostgreSQL
│   ├── lambda/         # Lambda関数
│   ├── api-gateway/    # API Gateway
│   └── amplify/        # Amplifyアプリケーション
└── environments/       # 環境別設定
    ├── dev/            # 開発環境
    └── prod/           # 本番環境
```

## 前提条件

1. Terraform >= 1.0 がインストールされていること
2. AWS CLIが設定されていること
3. 適切なAWS権限を持つIAMユーザー/ロールでアクセスできること
4. S3バケットとDynamoDBテーブル（Terraform state管理用）が作成済みであること

## Terraform State管理用リソースの作成

初回のみ、以下のリソースを手動で作成する必要があります：

```bash
# S3バケットの作成
aws s3api create-bucket \
  --bucket shirogane-holy-knights-terraform-state \
  --region ap-northeast-1 \
  --create-bucket-configuration LocationConstraint=ap-northeast-1

# バケットのバージョニング有効化
aws s3api put-bucket-versioning \
  --bucket shirogane-holy-knights-terraform-state \
  --versioning-configuration Status=Enabled

# DynamoDBテーブルの作成
aws dynamodb create-table \
  --table-name shirogane-holy-knights-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
  --region ap-northeast-1
```

## 使用方法

### 1. 環境変数の設定

```bash
cd environments/dev

# terraform.tfvarsファイルを作成
cp terraform.tfvars.example terraform.tfvars

# 必要な値を設定
vim terraform.tfvars
```

### 2. Terraformの初期化

```bash
terraform init -backend-config="../../backend.tf"
```

### 3. 実行計画の確認

```bash
terraform plan
```

### 4. インフラストラクチャの作成

```bash
terraform apply
```

### 5. インフラストラクチャの削除

```bash
terraform destroy
```

## 必要な設定値

`terraform.tfvars`に以下の値を設定する必要があります：

- `db_password`: RDSデータベースのパスワード
- `github_repository`: GitHubリポジトリのURL
- `github_access_token`: GitHub Personal Access Token（Amplify用）

## Lambda関数のビルドとデプロイ

Lambda関数をデプロイする前に、バックエンドのJARファイルをビルドする必要があります：

```bash
cd ../../../backend
./gradlew shadowJar
```

これにより、`backend/build/libs/backend-all.jar`が生成されます。

## 出力値

Terraformの実行後、以下の値が出力されます：

- `api_endpoint`: API GatewayのエンドポイントURL
- `amplify_app_url`: AmplifyアプリケーションのURL
- `database_endpoint`: RDSデータベースのエンドポイント
- `lambda_function_name`: Lambda関数名

## トラブルシューティング

### Lambda関数のコールドスタート改善

GraalVMネイティブイメージを使用する場合は、以下の手順でビルドしてください：

```bash
cd ../../../backend
./gradlew nativeCompile
```

### ネットワーク接続問題

Lambda関数がRDSに接続できない場合は、以下を確認してください：

1. Lambda関数とRDSが同じVPC内にある
2. セキュリティグループが適切に設定されている
3. サブネットのルーティングが正しい

## セキュリティ注意事項

- `terraform.tfvars`ファイルは機密情報を含むため、**絶対にGitにコミットしないでください**
- 本番環境では、AWS Secrets ManagerやParameter Storeを使用してパスワードを管理することを推奨します
- GitHub Personal Access Tokenは最小限の権限のみを付与してください