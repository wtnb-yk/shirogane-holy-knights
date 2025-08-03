# Lambda DB接続失敗の詳細調査結果

## 問題の概要

### 発生した問題
AWS dev環境でLambda関数起動時にDBマイグレーションが実行されず、以下のエラーが発生：

```
No qualifying bean of type 'io.r2dbc.spi.ConnectionFactory' available: expected at least 1 bean which qualifies as autowire candidate
```

### 影響範囲
- Lambda関数の完全な起動失敗
- Spring Bootアプリケーションコンテキストの初期化エラー
- DBマイグレーション処理の未実行
- API機能の全面停止

## 詳細調査結果

### 1. エラーログ解析

**核心エラー**:
```
UnsatisfiedDependencyException: Error creating bean with name 'videoController'
→ Error creating bean with name 'videoUseCaseImpl'
→ Error creating bean with name 'videoRepositoryImpl'  
→ Error creating bean with name 'r2dbcEntityTemplate'
→ No qualifying bean of type 'io.r2dbc.spi.ConnectionFactory' available
```

**重要な発見**:
- `R2dbcConfig.kt`に`@Bean fun connectionFactory()`が定義されている
- Bean定義は存在するが、Bean作成時に例外が発生
- Spring Bootが「Bean不存在」として扱っている

### 2. 環境変数設定の確認

**Lambda環境変数** (全て正常):
```json
{
  "SPRING_PROFILES_ACTIVE": "lambda",
  "SPRING_CLOUD_FUNCTION_DEFINITION": "apiGatewayFunction",
  "DATABASE_HOST": "shirogane-holy-knights-dev-db.chki60iywt92.ap-northeast-1.rds.amazonaws.com",
  "DATABASE_PORT": "5432",
  "DATABASE_NAME": "shirogane",
  "DATABASE_USERNAME": "shirogane_developer",
  "DATABASE_PASSWORD": "e7f72686-0fad-4962-a73b-b4f27418bb0e"
}
```

**R2dbcConfig.kt期待値**との比較:
- 全ての環境変数名が完全一致 ✅
- 値も適切に設定されている ✅

### 3. ネットワーク設定の検証

**RDSセキュリティグループ** (`sg-029504e8b38851587`):
- ポート5432のインバウンド許可 ✅
- LambdaセキュリティグループID `sg-0a33bd8cde89e8490`からのアクセス許可 ✅

**Lambda VPC設定**:
- 適切なVPCサブネット配置 ✅
- 正しいセキュリティグループ割り当て ✅

**結論**: ネットワーク設定に問題なし

### 4. Spring Bootプロファイル問題の特定

**重大な発見**:
```
INFO c.a.s.l.runtime.api.client.AWSLambda - No active profile set, falling back to 1 default profile: "default"
```

**設定との矛盾**:
- 環境変数: `SPRING_PROFILES_ACTIVE=lambda`
- 実際の動作: `default`プロファイル使用

**application.yml設定**:
- **default設定**: `sslmode=disable`
- **lambda設定**: `sslmode=require`

### 5. Spring Cloud Function設定の問題

**期待される動作**:
```
SPRING_CLOUD_FUNCTION_DEFINITION=apiGatewayFunction
→ Spring Cloud Function Lambda アダプター経由起動
→ 環境変数SPRING_PROFILES_ACTIVEの自動読み込み
```

**実際の動作**:
```
c.a.s.l.runtime.api.client.AWSLambda - Starting AWSLambda
→ 直接Spring Boot アプリケーション起動
→ プロファイル設定無効化
```

## 根本原因の特定

### JAR MANIFEST.MF設定の問題

**問題**: ビルドされたJARのMANIFEST.MFが以下のようになっている可能性:

```
Main-Class: com.shirogane.holy.knights.Application
```

**正しい設定**:
```
Main-Class: org.springframework.cloud.function.adapter.aws.FunctionInvoker
Start-Class: com.shirogane.holy.knights.Application
```

### 連鎖的な影響

1. **MANIFEST.MF不正** 
   ↓
2. **Spring Cloud Function無効化**
   ↓  
3. **環境変数`SPRING_PROFILES_ACTIVE`無視**
   ↓
4. **defaultプロファイル使用**
   ↓
5. **SSL設定不整合 (`sslmode=disable` vs RDS要求`sslmode=require`)**
   ↓
6. **DB接続失敗**
   ↓
7. **ConnectionFactory Bean作成失敗**
   ↓
8. **Spring Boot起動完全失敗**

## 解決策の提案

### 1. JAR作成プロセスの修正

**build.gradle.kts**の`shadowJar`タスク修正:

```kotlin
val springCloudFunctionLambdaJar by tasks.creating(ShadowJar::class) {
    manifest {
        attributes(
            "Main-Class" to "org.springframework.cloud.function.adapter.aws.FunctionInvoker",
            "Start-Class" to "com.shirogane.holy.knights.Application"
        )
    }
}
```

### 2. プロファイル設定の強化

**Application.kt**のプロファイル強制設定コードは存在するが効果なし:

```kotlin
// 現在のコード（無効）
val springProfilesActive = System.getenv("SPRING_PROFILES_ACTIVE")
if (springProfilesActive != null) {
    System.setProperty("spring.profiles.active", springProfilesActive)
    app.setAdditionalProfiles(springProfilesActive)
}
```

**理由**: Spring Cloud Function経由でない限り、このコードが実行される前に設定が確定している。

### 3. 検証手順

1. **JARのMANIFEST.MF確認**:
   ```bash
   jar tf build/libs/shirogane-holy-knights-*-lambda.jar | head -20
   unzip -p build/libs/shirogane-holy-knights-*-lambda.jar META-INF/MANIFEST.MF
   ```

2. **デプロイ後の動作確認**:
   ```bash
   aws lambda invoke --function-name shirogane-holy-knights-dev-api --payload '{}' response.json
   aws logs tail /aws/lambda/shirogane-holy-knights-dev-api --since 5m
   ```

3. **プロファイル確認**:
   - ログで`lambda`プロファイルが使用されているか確認
   - `sslmode=require`でDB接続されているか確認

## 学習事項

### 設定の優先順位と相互作用

1. **JAR MANIFEST.MF** > 環境変数設定
2. **Spring Cloud Function** 有効時のみ環境変数読み込み
3. **プロファイル確定** はSpring Boot起動時の早期段階

### 診断のポイント

1. **ログの起動クラス確認**: `FunctionInvoker` vs `AWSLambda`
2. **プロファイル設定確認**: `default` vs `lambda`
3. **Bean作成失敗の真因**: 設定値ではなく接続レベルの問題

### 今後の予防策

1. **CI/CDパイプラインでのMANIFEST.MF検証**
2. **デプロイ後の自動プロファイル確認**
3. **DB接続テストの分離実行**

---

**作成日**: 2025-08-02  
**調査者**: Claude Code  
**対象環境**: AWS Lambda (shirogane-holy-knights-dev-api)