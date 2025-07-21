# Docker環境での動作確認手順

## 1. Docker環境の起動

```bash
# プロジェクトのルートディレクトリで実行
docker-compose up -d
```

## 2. 各コンテナの起動状態確認

```bash
# コンテナの状態確認
docker-compose ps

# ログの確認
docker-compose logs -f
```

## 3. Lambda機能の動作確認

ブラウザで http://localhost:3001 にアクセスし、アーカイブ一覧を表示します。
この時、バックエンドはLambda関数モードで動作しています。

### 主要なURL
- フロントエンド: http://localhost:3001
- バックエンドAPI: http://localhost:8080/actuator/health
- Lambdaエンドポイント: http://localhost:8080/archiveSearch

### APIリクエスト例

```bash
# アーカイブ検索Lambda関数を直接呼び出し
curl -X POST http://localhost:8080/archiveSearch \
  -H "Content-Type: application/json" \
  -d '{"page": 1, "pageSize": 10}'
```

## 4. 問題が発生した場合

### CORS関連エラーが発生する場合
ブラウザの開発者ツールでCORSエラーが表示される場合、以下を確認してください。

1. バックエンドのログを確認
```bash
docker-compose logs -f backend
```

2. フロントエンドの環境変数が正しく設定されているか確認
```bash
# docker-compose.yml内のフロントエンド設定
# NEXT_PUBLIC_API_BASE_URL: http://localhost:8080
```

### コンテナが起動しない場合
1. ヘルスチェックのログを確認
```bash
docker-compose logs -f
```

2. 各コンテナを個別に再起動
```bash
docker-compose restart backend
docker-compose restart frontend
```

## 5. 環境の停止

```bash
# 環境を停止
docker-compose down

# データベースのボリュームも含めて完全に削除
docker-compose down -v
```