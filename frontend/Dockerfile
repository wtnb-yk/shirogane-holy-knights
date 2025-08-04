FROM node:18-alpine

# ヘルスチェック用のcurlとその他の必要なツールをインストール
RUN apk add --no-cache curl

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .


# 環境変数
ENV NODE_ENV=development
ENV NEXT_PUBLIC_API_URL=http://localhost:8080

# ポート
EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "run", "dev"]