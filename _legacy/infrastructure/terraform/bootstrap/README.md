# Terraform Backend Bootstrap

このディレクトリは、Terraformのremote state管理に必要なAWSリソース（S3バケット、DynamoDBテーブル）を作成・管理します。

## 概要

Terraformでインフラストラクチャを管理する際、state fileをリモートに保存し、複数人での同時実行を防ぐためのlockメカニズムが必要です。しかし、これらのリソース自体をTerraformで管理しようとすると「鶏と卵の問題」が発生します。

このbootstrapモジュールは、その問題を解決するため、backend用のリソースを独立して管理します。

## 作成されるリソース

- **S3バケット**: `shirogane-holy-knights-terraform-state`
  - Terraform stateファイルの保存用
  - バージョニング有効
  - 暗号化有効
  - パブリックアクセス無効

- **DynamoDBテーブル**: `shirogane-holy-knights-terraform-locks`
  - State lock管理用
  - PAY_PER_REQUESTモード（使用分のみ課金）

## 初期セットアップ手順

### 1. 初回実行（プロジェクト開始時のみ）

```bash
# bootstrapディレクトリに移動
cd infrastructure/terraform/bootstrap

# Terraform初期化
terraform init

# 実行計画の確認
terraform plan

# リソースの作成
terraform apply
```

### 2. 作成確認

```bash
# 作成されたリソースの確認
terraform output

# AWS CLIでの確認
aws s3 ls s3://shirogane-holy-knights-terraform-state/
aws dynamodb describe-table --table-name shirogane-holy-knights-terraform-locks
```

## 既存リソースがある場合

既にS3バケットやDynamoDBテーブルが存在する場合、importして管理下に置くことができます：

```bash
# S3バケットのimport
terraform import aws_s3_bucket.terraform_state shirogane-holy-knights-terraform-state

# DynamoDBテーブルのimport
terraform import aws_dynamodb_table.terraform_locks shirogane-holy-knights-terraform-locks
```

## 注意事項

1. **このディレクトリのstateはローカル管理**
   - `.terraform/`と`terraform.tfstate*`はgitignoreに追加済み
   - チーム内で共有する必要はありません

2. **削除には注意**
   - これらのリソースを削除すると、全環境のTerraform stateにアクセスできなくなります
   - `prevent_destroy = true`を設定することを推奨

3. **実行頻度**
   - 通常、プロジェクト開始時に一度だけ実行
   - 以降は変更の必要がない限り触らない

## トラブルシューティング

### リソースが既に存在するエラー

```bash
# 既存リソースをimport
terraform import aws_s3_bucket.terraform_state shirogane-holy-knights-terraform-state
terraform import aws_dynamodb_table.terraform_locks shirogane-holy-knights-terraform-locks
```

### 権限エラー

必要なIAM権限：
- S3: CreateBucket, PutBucketVersioning, PutBucketEncryption, PutBucketPublicAccessBlock
- DynamoDB: CreateTable, DescribeTable
- タグ付け権限

### State lockエラーが発生した場合

メインのTerraformでstate lockエラーが発生した場合：

1. このbootstrapでDynamoDBテーブルが作成されていることを確認
2. テーブル名が`backend.tf`の設定と一致していることを確認
3. AWS認証情報が正しいことを確認

## 関連ファイル

- `environments/dev/backend.tf` - 開発環境のbackend設定
- `environments/prd/backend.tf` - 本番環境のbackend設定

これらのファイルで、ここで作成したリソースを参照しています。