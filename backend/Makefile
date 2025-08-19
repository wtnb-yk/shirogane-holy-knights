.PHONY: deploy info clean build jar help

# LocalStack Lambda環境のデプロイ
deploy:
	./gradlew localStackDeploy

# デプロイ情報の表示  
info:
	./gradlew localStackInfo

# LocalStack環境のクリーンアップ
clean:
	./gradlew cleanLocalStackLambda

# ビルドのみ（テスト除外）
build:
	./gradlew clean build --exclude-task test

# Lambda JARのビルド
jar:
	./gradlew springCloudFunctionLambdaJar

# ヘルプ表示
help:
	@echo "Available commands:"
	@echo "  make deploy  - Deploy Lambda to LocalStack"
	@echo "  make info    - Show deployment info"
	@echo "  make clean   - Clean LocalStack Lambda"
	@echo "  make build   - Build project (exclude tests)"
	@echo "  make jar     - Build Lambda JAR only"