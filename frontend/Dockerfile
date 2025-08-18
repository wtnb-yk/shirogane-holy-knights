FROM node:20-alpine

# ヘルスチェック用のcurlとその他の必要なツールをインストール
RUN apk add --no-cache curl

# pnpmを有効化
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# package.json、pnpm-lock.yaml、.npmrcをコピー
COPY package.json pnpm-lock.yaml .npmrc ./

# 依存関係をインストール
RUN pnpm install --frozen-lockfile

# アプリケーションのソースコードをコピー
COPY . .


# 環境変数
ENV NODE_ENV=development
ENV NEXT_PUBLIC_API_URL=http://localhost:8080

# ポート
EXPOSE 3000

# アプリケーションを起動
CMD ["pnpm", "run", "dev"]