# ヘルスチェックシステム実装完了

## 実装内容

だんいんポータル API に段階的ヘルスチェックシステムを実装しました。デプロイメント時の安定性向上と一時的エラーの解消を目的としています。

**重要**: このシステムはLambda + API Gatewayアーキテクチャに最適化されており、コンテナベースのヘルスチェックではなく、API エンドポイントベースのヘルスチェックを提供します。

## 新機能

### 1. 段階的ヘルスチェックエンドポイント

| エンドポイント         | 説明                     | チェック内容             |
| ---------------------- | ------------------------ | ------------------------ |
| `GET /health`          | 従来の軽量ヘルスチェック | 基本的な生存確認         |
| `GET /health/basic`    | 基本ヘルスチェック       | サービス起動確認         |
| `GET /health/detailed` | 詳細ヘルスチェック       | データベース接続確認含む |
| `GET /health/complete` | 完全ヘルスチェック       | 全依存関係の確認         |
| `GET /health/ready`    | デプロイメント完了判定   | 段階的チェック実行       |

### 2. ヘルスステータス

- **HEALTHY**: 正常
- **DEGRADED**: 一部機能に問題があるが利用可能
- **UNHEALTHY**: 利用不可

### 3. デプロイメント完了判定

段階的チェックを実行してデプロイメントの完了を確認：

1. **Basic Health Check** - サービスの基本起動確認
2. **Detailed Health Check** - データベース接続確認
3. **Complete Health Check** - 全依存関係の確認

## 使用方法

### スクリプトによる確認

```bash
# デプロイメント完了判定（推奨）
./scripts/check-deployment-readiness.sh

# カスタム設定
./scripts/check-deployment-readiness.sh \
  --url https://dev-api.shirogane-portal.com \
  --max-attempts 15 \
  --delay 3

# 単発ヘルスチェック
./scripts/health-check.sh --level detailed
```

### API による直接確認

```bash
# 基本ヘルスチェック
curl https://api.shirogane-portal.com/health/basic

# 詳細ヘルスチェック
curl https://api.shirogane-portal.com/health/detailed

# 完全ヘルスチェック
curl https://api.shirogane-portal.com/health/complete

# デプロイメント完了判定
curl https://api.shirogane-portal.com/health/ready
```

## レスポンス例

### 正常時（200 OK）

```json
{
  "status": "healthy",
  "service": "shirogane-holy-knights-api",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "uptime": 3600,
  "checks": {
    "service": {
      "status": "healthy",
      "message": "Service is running",
      "responseTime": 0
    },
    "database": {
      "status": "healthy",
      "message": "Database connection successful",
      "responseTime": 45,
      "details": {
        "host": "localhost",
        "port": "5432"
      }
    }
  }
}
```

### 異常時（503 Service Unavailable）

```json
{
  "status": "unhealthy",
  "service": "shirogane-holy-knights-api",
  "timestamp": "2024-01-15T10:30:00Z",
  "checks": {
    "database": {
      "status": "unhealthy",
      "message": "Database connection failed: Connection refused",
      "details": {
        "error": "ConnectException",
        "host": "localhost",
        "port": "5432"
      }
    }
  }
}
```

## CI/CD パイプラインでの使用

### AWS CodeBuild（buildspec-deploy.yml）

```yaml
post_build:
  commands:
    - echo "Starting deployment health check..."
    - chmod +x scripts/health-check-deployment.sh
    - scripts/health-check-deployment.sh
```

### GitHub Actions 例

```yaml
- name: Deploy and health check
  run: |
    # デプロイ後のヘルスチェック
    export LAMBDA_FUNCTION_NAME="shirogane-${{ env.ENVIRONMENT }}-api"
    export API_GATEWAY_NAME="shirogane-${{ env.ENVIRONMENT }}-api"
    export ENVIRONMENT="${{ env.ENVIRONMENT }}"
    export AWS_DEFAULT_REGION="ap-northeast-1"
    ./scripts/health-check-deployment.sh
  env:
    ENVIRONMENT: ${{ github.ref == 'refs/heads/main' && 'prod' || 'dev' }}
```

### 環境変数

CI/CD パイプラインで以下の環境変数を設定してください：

```bash
# 必須
LAMBDA_FUNCTION_NAME="shirogane-dev-api"
API_GATEWAY_NAME="shirogane-dev-api"
ENVIRONMENT="dev"
AWS_DEFAULT_REGION="ap-northeast-1"

# オプション
MAX_ATTEMPTS=30
RETRY_DELAY=10
TIMEOUT=15
```

## 実装ファイル

### バックエンド

- `backend/src/main/kotlin/com/shirogane/holy/knights/domain/model/HealthCheck.kt` - ドメインモデル
- `backend/src/main/kotlin/com/shirogane/holy/knights/domain/service/HealthCheckService.kt` - サービスインターフェース
- `backend/src/main/kotlin/com/shirogane/holy/knights/application/service/HealthCheckServiceImpl.kt` - サービス実装
- `backend/src/main/kotlin/com/shirogane/holy/knights/application/service/DeploymentReadinessService.kt` - デプロイメント判定サービス
- `backend/src/main/kotlin/com/shirogane/holy/knights/adapter/controller/HealthController.kt` - コントローラー（更新）

### スクリプト

- `scripts/check-deployment-readiness.sh` - デプロイメント完了判定スクリプト
- `scripts/health-check.sh` - 単発ヘルスチェックスクリプト
- `scripts/health-check-deployment.sh` - CI/CDパイプライン用デプロイメントヘルスチェック

### インフラストラクチャ

- `buildspec-deploy.yml` - デプロイパイプラインでのヘルスチェック統合（更新）
- `docker-compose.yml` - ローカル開発環境でのヘルスチェック（更新）

### ドキュメント

- `backend/docs/health-check-system.md` - 詳細ドキュメント

## テスト

基本的なヘルスチェック機能のテストを実装：

```bash
./gradlew test --tests "HealthControllerTest"
```

## 設定

### 環境変数

| 変数名          | 説明               | デフォルト値 |
| --------------- | ------------------ | ------------ |
| `DATABASE_HOST` | データベースホスト | localhost    |
| `DATABASE_PORT` | データベースポート | 5432         |
| `DATABASE_NAME` | データベース名     | shirogane    |

### タイムアウト設定

- データベース接続タイムアウト: 5 秒
- データベーステーブルチェックタイムアウト: 10 秒
- デプロイメント完了判定リトライ間隔: 2 秒
- デプロイメント完了判定最大試行回数: 30 回

## 利点

1. **デプロイメント安定性向上**: 段階的チェックによりデプロイメント完了を正確に判定
2. **一時的エラーの解消**: リトライ機能により一時的な接続エラーを回避
3. **詳細な診断情報**: 各コンポーネントの状態を個別に確認可能
4. **運用効率向上**: スクリプトによる自動化対応
5. **構造化レスポンス**: 詳細な診断情報の提供

## 今後の拡張予定

- Prometheus メトリクス出力
- 外部サービス依存関係チェック
- カスタムヘルスチェック追加機能
