# バッチスケジューラ設計書

## 概要

日本時間0:00に`make sync-prd`を自動実行するAWS EventBridge + Lambda構成のバッチスケジューラ

## システム構成

### アーキテクチャ

```
EventBridge Schedule Rule(日本時間 12:00, 18:00)
        ↓
Lambda Function (sync-batch)
        ↓
YouTube Data API → CSV生成 → PostgreSQL (RDS)
```

### 技術スタック

- **スケジューラ**: AWS EventBridge Schedule Rules
- **実行環境**: AWS Lambda (Python 3.11)
- **依存関係**: Lambda Layer (google-api-python-client, pandas, psycopg2-binary)
- **VPC**: 既存のRDS接続用VPC設定
- **監視**: CloudWatch Logs + Alarms

## コスト試算

### 月間実行コスト (30回実行想定)

| サービス | 料金 | 計算 | 月額 |
|---------|-----|------|------|
| EventBridge | $1.00/100万イベント | 30回/月 | $0.00003 |
| Lambda リクエスト | $0.20/100万リクエスト | 30回/月 | $0.000006 |
| Lambda 実行時間 | $0.0000166667/GB秒 | 30回×0.5GB×600秒 | $0.15 |
| **合計** | | | **$0.15/月** |

**年間総額**: 約$1.80 (約270円)

## ファイル構成

```
infrastructure/
├── docs/
│   └── batch-scheduler.md         # この設計書
├── lambda/
│   ├── sync-batch/
│   │   ├── handler.py            # Lambdaハンドラ
│   │   └── requirements.txt      # Python依存関係
│   └── layers/
│       └── python-deps/          # Lambda Layer
└── terraform/
    ├── modules/
    │   └── batch-scheduler/       # バッチスケジューラモジュール
    │       ├── main.tf
    │       ├── variables.tf
    │       └── outputs.tf
    └── environments/
        └── prd/
            └── main.tf            # batch-schedulerモジュール呼び出し
```

## 実行スケジュール

- **実行時間**: 日本時間 0:00 (UTC 15:00)
- **スケジュール式**: `cron(0 15 * * ? *)`
- **実行頻度**: 毎日1回

## 環境変数設定

### Lambda環境変数

| 変数名 | 説明 | 値 |
|-------|------|---|
| `ENV_FILE` | 環境設定ファイルパス | `/opt/config/.env.prd` |
| `DB_HOST` | RDSエンドポイント | 既存RDS設定から参照 |
| `DB_NAME` | データベース名 | `shirogane` |
| `DB_USERNAME` | DB接続ユーザー | `postgres` |
| `DB_PASSWORD` | DB接続パスワード | Secrets Managerから取得 |
| `YOUTUBE_API_KEY` | YouTube Data API キー | Secrets Managerから取得 |

## VPC設定

- **VPC**: 既存のメインVPC
- **サブネット**: プライベートサブネット (RDS接続用)
- **セキュリティグループ**: RDSアクセス許可

## 監視・アラート

### CloudWatch Logs
- ログ保持期間: 7日間
- ログレベル: INFO以上

### CloudWatch Alarms
- Lambda実行エラー時のアラート
- 実行時間が10分を超過した場合のアラート

## デプロイ手順

### 1. Lambda Layer構築
```bash
cd infrastructure/lambda/layers/python-deps
pip install -r requirements.txt -t python/lib/python3.11/site-packages/
zip -r python-deps.zip python/
```

### 2. Terraformデプロイ
```bash
# 本番環境プラン確認
gh workflow run terraform.yml --field environment=prd --field action=plan

# 本番環境適用
gh workflow run terraform.yml --field environment=prd --field action=apply
```

### 3. 動作確認
```bash
# EventBridge手動実行
aws events put-events --entries Source=batch-scheduler,DetailType=manual-trigger

# Lambda実行ログ確認
aws logs tail /aws/lambda/sync-batch-prd --follow
```

## 運用・メンテナンス

### 手動実行
EventBridge経由での手動実行が可能
```bash
aws events put-events --entries Source=batch-scheduler,DetailType=manual-trigger
```

### ログ確認
```bash
# 実行ログ確認
aws logs tail /aws/lambda/sync-batch-prd --since 1h

# エラーログフィルタ
aws logs filter-log-events --log-group-name /aws/lambda/sync-batch-prd --filter-pattern "ERROR"
```

### トラブルシューティング

#### よくある問題
1. **VPC接続エラー**: セキュリティグループ設定確認
2. **DB接続タイムアウト**: RDSエンドポイント・認証情報確認  
3. **YouTube API制限**: APIキー・クォータ確認

#### 緊急時の対応
- EventBridge Rule無効化: `aws events disable-rule --name sync-batch-prd-schedule`
- Lambda関数無効化: Terraform経由で一時的にコメントアウト

## セキュリティ考慮事項

- **認証情報管理**: AWS Secrets Manager使用
- **VPC内実行**: インターネットアクセスはNAT Gateway経由
- **IAM権限**: 最小権限の原則に従った設定
- **ログ**: 機密情報のマスキング実装
