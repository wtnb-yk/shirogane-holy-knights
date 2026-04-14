# ヘルスチェックシステム

## 概要

だんいんポータルAPIでは、デプロイメント時の安定性向上と一時的エラーの解消を目的として、段階的ヘルスチェックシステムを実装しています。

## ヘルスチェックエンドポイント

### 基本エンドポイント

| エンドポイント | 説明 | 用途 |
|---|---|---|
| `GET /health` | 従来の軽量ヘルスチェック | 基本的な生存確認 |
| `GET /health/basic` | 基本ヘルスチェック | サービス起動確認 |
| `GET /health/detailed` | 詳細ヘルスチェック | データベース接続確認含む |
| `GET /health/complete` | 完全ヘルスチェック | 全依存関係の確認 |
| `GET /health/ready` | デプロイメント完了判定 | デプロイメント完了確認 |

### レスポンス形式

#### 成功時（200 OK）

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
    },
    "database_tables": {
      "status": "healthy",
      "message": "All required tables exist",
      "responseTime": 120,
      "details": {
        "table_count": 4
      }
    }
  }
}
```

#### 劣化状態（200 OK）

```json
{
  "status": "degraded",
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
      "responseTime": 45
    },
    "database_tables": {
      "status": "degraded",
      "message": "Some required tables are missing",
      "responseTime": 120,
      "details": {
        "table_count": 2,
        "expected": 4
      }
    }
  }
}
```

#### 異常時（503 Service Unavailable）

```json
{
  "status": "unhealthy",
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

## ヘルスチェックレベル

### 1. Basic（基本）
- **目的**: サービスの基本的な起動確認
- **チェック内容**: 
  - サービス起動状態
- **応答時間**: < 100ms
- **用途**: ロードバランサーのヘルスチェック

### 2. Detailed（詳細）
- **目的**: データベース接続を含む詳細確認
- **チェック内容**:
  - サービス起動状態
  - データベース接続確認
- **応答時間**: < 5秒
- **用途**: デプロイメント初期段階の確認

### 3. Complete（完全）
- **目的**: 全依存関係の完全確認
- **チェック内容**:
  - サービス起動状態
  - データベース接続確認
  - データベーステーブル存在確認
- **応答時間**: < 10秒
- **用途**: デプロイメント完了確認

## デプロイメント完了判定

### 段階的チェック

デプロイメント完了判定では、以下の段階的チェックを実行します：

1. **Basic Health Check**
   - サービスの基本起動確認
   - 失敗時はリトライ

2. **Detailed Health Check**
   - データベース接続確認
   - 失敗時はリトライ

3. **Complete Health Check**
   - 全依存関係の確認
   - 劣化状態でも警告として継続

### 使用方法

#### スクリプトによる確認

```bash
# 基本的な使用方法
./scripts/check-deployment-readiness.sh

# カスタム設定
./scripts/check-deployment-readiness.sh \
  --url https://dev-api.shirogane-portal.com \
  --max-attempts 15 \
  --delay 3

# 環境変数による設定
API_BASE_URL=https://dev-api.shirogane-portal.com \
MAX_ATTEMPTS=20 \
RETRY_DELAY=5 \
./scripts/check-deployment-readiness.sh
```

#### 単発ヘルスチェック

```bash
# 基本ヘルスチェック
./scripts/health-check.sh --level basic

# 詳細ヘルスチェック
./scripts/health-check.sh --level detailed

# 完全ヘルスチェック
./scripts/health-check.sh --level complete

# デプロイメント完了判定
./scripts/health-check.sh --level ready
```

#### APIによる直接確認

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

## CI/CDパイプラインでの使用

### GitHub Actions例

```yaml
- name: Wait for deployment readiness
  run: |
    ./scripts/check-deployment-readiness.sh \
      --url ${{ env.API_BASE_URL }} \
      --max-attempts 30 \
      --delay 10
  env:
    API_BASE_URL: https://api.shirogane-portal.com
```

### AWS CodeDeploy例

```bash
#!/bin/bash
# ApplicationStop hook
./scripts/check-deployment-readiness.sh \
  --url https://api.shirogane-portal.com \
  --max-attempts 60 \
  --delay 5
```

## ログ出力

ヘルスチェック実行時は以下の情報がログ出力されます：

```
[INFO] Health check requested with level: DETAILED
[INFO] Performing detailed health check
[DEBUG] Database connection check successful in 45ms
[INFO] Health check completed: HEALTHY
```

## トラブルシューティング

### よくある問題

1. **データベース接続タイムアウト**
   - 原因: データベースサーバーの応答遅延
   - 対処: タイムアウト時間の調整、データベースサーバーの確認

2. **テーブル不存在エラー**
   - 原因: データベースマイグレーションの未実行
   - 対処: マイグレーションスクリプトの実行確認

3. **デプロイメント完了判定の失敗**
   - 原因: 段階的チェックのいずれかが失敗
   - 対処: 個別レベルでのヘルスチェック実行、ログ確認

### デバッグ方法

```bash
# 詳細ログ付きでヘルスチェック実行
./scripts/health-check.sh --level detailed --verbose

# 個別コンポーネントの確認
curl -v https://api.shirogane-portal.com/health/detailed | jq .
```

## 設定

### 環境変数

| 変数名 | 説明 | デフォルト値 |
|---|---|---|
| `DATABASE_HOST` | データベースホスト | localhost |
| `DATABASE_PORT` | データベースポート | 5432 |
| `DATABASE_NAME` | データベース名 | shirogane |
| `DATABASE_USERNAME` | データベースユーザー名 | - |
| `DATABASE_PASSWORD` | データベースパスワード | - |

### タイムアウト設定

- データベース接続タイムアウト: 5秒
- データベーステーブルチェックタイムアウト: 10秒
- デプロイメント完了判定リトライ間隔: 2秒
- デプロイメント完了判定最大試行回数: 30回