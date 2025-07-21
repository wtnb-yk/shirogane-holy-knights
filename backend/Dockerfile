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
RUN ./gradlew build -x processAot --no-daemon


# 環境変数
ENV JDBC_DATABASE_URL=jdbc:postgresql://postgres:5432/shirogane_db
ENV JDBC_DATABASE_USERNAME=postgres
ENV JDBC_DATABASE_PASSWORD=postgres
ENV FRONTEND_URL=http://localhost:3001
ENV SPRING_PROFILES_ACTIVE=lambda-local

# メインクラスを直接実行する
# 起動コマンド
ENTRYPOINT ["java", "-jar", "/app/build/libs/shirogane-holy-knights-0.1.0.jar"]

# コンテナがリッスンするポート
EXPOSE 8080