# CI/CD Pipeline Documentation

このディレクトリには、団員ポータルのCI/CDパイプライン設定が含まれています。

## GitHub Actions ワークフロー

### 1. Backend Build and Test (`backend-build.yml`)

**トリガー:**
- `main`または`develop`ブランチへのpush（`backend/`配下の変更時）
- Pull Request（`backend/`配下の変更時）

**機能:**
- JDK 17のセットアップ
- Gradleビルドとテスト実行
- Shadow JARの作成
- アーティファクトのアップロード
- テストレポートの生成

### 2. Lambda Deploy (`lambda-deploy.yml`)

**トリガー:**
- 手動実行（workflow_dispatch）
- `main`ブランチへのpush（`backend/`配下の変更時）

**機能:**
- Shadow JARのビルド
- AWS Lambda関数へのデプロイ
- Lambda設定の更新
- バージョンの発行

**必要なSecrets:**
- `AWS_DEPLOY_ROLE_ARN`: デプロイ用IAMロールのARN

### 3. Terraform Deploy (`terraform-deploy.yml`)

**トリガー:**
- 手動実行（workflow_dispatch）
- Pull Request（`infrastructure/terraform/`配下の変更時）

**機能:**
- Terraformフォーマットチェック
- Terraform初期化と検証
- 実行計画の作成
- インフラストラクチャの適用/破棄
- Pull Requestへのコメント追加

**必要なSecrets:**
- `AWS_DEPLOY_ROLE_ARN`: デプロイ用IAMロールのARN
- `GITHUB_TOKEN`: GitHub APIアクセス用（自動提供）

### 4. Frontend Test and Build (`frontend-test.yml`)

**トリガー:**
- `main`または`develop`ブランチへのpush（`frontend/`配下の変更時）
- Pull Request（`frontend/`配下の変更時）

**機能:**
- Node.js 18.xと20.xでのテスト
- Lintとタイプチェック
- テスト実行
- ビルド
- バンドルサイズレポート

### 5. Deploy Pipeline (`deploy-pipeline.yml`)

**トリガー:**
- `main`ブランチへのpush
- 手動実行（workflow_dispatch）

**機能:**
- バックエンドとフロントエンドの並列ビルド
- Terraform計画の確認（手動実行時）
- Lambda関数へのデプロイ
- Amplifyデプロイのトリガー
- デプロイメントサマリーの生成

## セットアップ手順

### 1. AWS IAMロールの作成

GitHub ActionsからAWSリソースにアクセスするためのIAMロールを作成します：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_GITHUB_ORG/shirogane-holy-knights:*"
        }
      }
    }
  ]
}
```

### 2. GitHub Secretsの設定

リポジトリの Settings > Secrets and variables > Actions で以下を設定：

- `AWS_DEPLOY_ROLE_ARN`: 作成したIAMロールのARN
- `API_ENDPOINT`: API GatewayのエンドポイントURL（オプション）

### 3. ブランチ保護ルールの設定

`main`ブランチに以下の保護ルールを適用することを推奨：

- Pull Requestレビューの必須化
- ステータスチェックの必須化
  - backend-build
  - frontend-test
  - terraform (plan)
- 直接pushの禁止

## デプロイフロー

### 開発環境（dev）

1. `develop`ブランチで開発
2. Pull Requestを`main`ブランチに作成
3. 自動テストとTerraform planの確認
4. レビュー承認後にマージ
5. 自動的にdev環境へデプロイ

### 本番環境（prod）

1. `main`ブランチの安定版を確認
2. GitHub Actionsの手動実行でprod環境を選択
3. Terraform planの確認
4. 承認後にデプロイ実行

## トラブルシューティング

### Lambda デプロイエラー

```bash
# Lambda関数の状態確認
aws lambda get-function --function-name shirogane-holy-knights-dev-api

# CloudWatch Logsの確認
aws logs tail /aws/lambda/shirogane-holy-knights-dev-api --follow
```

### Terraform エラー

```bash
# 状態ファイルの確認
aws s3 ls s3://shirogane-holy-knights-terraform-state/

# ロックの解除（必要な場合）
aws dynamodb delete-item \
  --table-name shirogane-holy-knights-terraform-locks \
  --key '{"LockID":{"S":"shirogane-holy-knights-terraform-state/env/dev/terraform.tfstate"}}'
```

### Amplify デプロイエラー

```bash
# Amplifyアプリの状態確認
aws amplify get-app --app-id YOUR_APP_ID

# ビルドログの確認
aws amplify get-job --app-id YOUR_APP_ID --branch-name main --job-id YOUR_JOB_ID
```

## ベストプラクティス

1. **コミットメッセージ**: 明確で説明的なメッセージを使用
2. **ブランチ戦略**: Git Flowまたは GitHub Flowに従う
3. **テスト**: デプロイ前に全てのテストが通ることを確認
4. **ロールバック**: 問題発生時は前のバージョンに戻す準備を整える
5. **モニタリング**: デプロイ後はCloudWatchでエラーを監視