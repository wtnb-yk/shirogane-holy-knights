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


# メインクラスを直接実行する
# 起動コマンド
ENTRYPOINT ["java", "-jar", "/app/build/libs/shirogane-holy-knights-0.1.0.jar"]

# コンテナがリッスンするポート
EXPOSE 8080