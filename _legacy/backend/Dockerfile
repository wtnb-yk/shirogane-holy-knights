FROM amazoncorretto:17-alpine

# 作業ディレクトリ
WORKDIR /app

# AWS CLI、curl、bashをインストール
RUN apk add --no-cache curl bash aws-cli

# GradleラッパーとビルドファイルをコピーしてGradleの依存関係をキャッシュ
COPY gradlew ./
COPY gradle ./gradle
COPY build.gradle.kts ./
COPY settings.gradle.kts ./
RUN chmod +x ./gradlew

# ソースコードをコピー
COPY src ./src

# Lambda用JARをビルド
RUN ./gradlew springCloudFunctionLambdaJar --no-daemon