FROM amazoncorretto:17-alpine

# 作業ディレクトリ
WORKDIR /app

# アプリケーションの依存関係をインストール
RUN apk add --no-cache curl bash

# GradleラッパーとビルドファイルをコピーしてGradleの依存関係をキャッシュ
COPY gradlew ./
COPY gradle ./gradle
COPY build.gradle.kts ./
COPY settings.gradle.kts ./
RUN chmod +x ./gradlew

# ソースコードをコピー
COPY src ./src

# アプリケーションをビルド
RUN ./gradlew build --no-daemon

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD wget -q -O /dev/null http://localhost:8080/health || exit 1

# 環境変数
ENV JDBC_DATABASE_URL=jdbc:postgresql://postgres:5432/shirogane_db
ENV JDBC_DATABASE_USERNAME=postgres
ENV JDBC_DATABASE_PASSWORD=postgres
ENV FRONTEND_URL=http://localhost:3000

# メインクラスを直接実行する
# 起動コマンド
ENTRYPOINT ["java", "-cp", "/app/build/libs/shirogane-holy-knights-all.jar", "com.shirogane.holy.knights.Application"]

# コンテナがリッスンするポート
EXPOSE 8080