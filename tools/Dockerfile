FROM python:3.11-slim

# 作業ディレクトリ設定
WORKDIR /app

# システムパッケージ更新
RUN apt-get update && apt-get install -y \
    gcc \
    make \
    && rm -rf /var/lib/apt/lists/*

# Python依存関係をコピーしてインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションファイルをコピー
COPY . .

# AWS用環境変数設定ファイル作成スクリプト
RUN echo '#!/bin/bash\n\
echo "API_KEY=${YOUTUBE_API_KEY}" > config/.env.prd\n\
echo "CHANNEL_ID=UC4AkWKIa3tFtOZeaKo7b8BA" >> config/.env.prd\n\
echo "DB_HOST=${DB_HOST}" >> config/.env.prd\n\
echo "DB_PORT=5432" >> config/.env.prd\n\
echo "DB_NAME=shirogane" >> config/.env.prd\n\
echo "DB_USER=${DB_USERNAME}" >> config/.env.prd\n\
echo "DB_PASSWORD=${DB_PASSWORD}" >> config/.env.prd\n\
make sync-prd\n\
' > /app/run-batch.sh && chmod +x /app/run-batch.sh

# デフォルトコマンド
CMD ["/app/run-batch.sh"]