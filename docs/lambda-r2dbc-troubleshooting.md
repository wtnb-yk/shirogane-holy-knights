# Lambda環境でのR2DBC統合トラブルシューティング記録

## 概要
Spring Boot + R2DBC + PostgreSQLをAWS Lambda環境で動作させる際に発生した問題と対応策の記録。

## 環境情報
- **日時**: 2025年7月27日
- **Spring Boot**: 3.2.5
- **R2DBC PostgreSQL**: 1.0.5.RELEASE
- **Java**: 17
- **AWS Lambda**: Java17ランタイム
- **ビルドツール**: Gradle + Shadow JAR Plugin

## 問題の経緯

### 初期状態
- ローカル環境では正常に動作（Spring Boot + R2DBC + PostgreSQL）
- Lambda環境では`Internal server error`が発生

### 発生したエラーパターン

#### 1. BindMarkersFactoryエラー（最も頻発）
```
Cannot determine a BindMarkersFactory for PostgreSQL using [ConnectionFactory実装]
```

#### 2. R2dbcEntityTemplate Bean作成失敗
```
No qualifying bean of type 'org.springframework.data.r2dbc.core.R2dbcEntityTemplate' available
```

#### 3. Dialectエラー
```
Cannot determine a dialect for PostgreSQL using ConnectionPool[PostgreSQL]; Please provide a Dialect
```

## 試行した解決策

### 1. DatabaseConfig手動設定
**目的**: Spring Boot自動設定ではなく手動でBeanを作成  
**結果**: ❌ 同様のBindMarkersFactoryエラー

```kotlin
@Configuration
@EnableR2dbcRepositories
class DatabaseConfig {
    @Bean
    fun connectionFactory(): ConnectionFactory {
        val config = PostgresqlConnectionConfiguration.builder()
            .host(host)
            .port(port.toInt())
            .database(database)
            .username(username)
            .password(password)
            .build()
        
        return PostgresqlConnectionFactory(config)
    }
    
    @Bean
    fun r2dbcEntityTemplate(connectionFactory: ConnectionFactory): R2dbcEntityTemplate {
        return R2dbcEntityTemplate(connectionFactory, PostgresDialect.INSTANCE)
    }
}
```

### 2. コネクションプール設定の変更
**目的**: ConnectionPoolが原因かを確認  
**結果**: ❌ 直接ConnectionFactoryでも同様のエラー

### 3. R2DBCバージョン変更
**目的**: バージョン互換性問題の解決  
**結果**: ❌ 1.0.4 → 1.0.5でも解決せず

### 4. Shadow JAR設定の調整
**目的**: ServiceLoaderメタデータの正しいマージ  
**結果**: ❌ mergeServiceFiles()でも解決せず

```kotlin
shadowJar {
    mergeServiceFiles()
    archiveClassifier.set("all")
    manifest {
        attributes["Main-Class"] = "com.shirogane.holy.knights.Application"
    }
}
```

### 5. Springプロファイル設定の修正
**目的**: Lambda環境でlambdaプロファイルを確実に読み込む  
**結果**: ❌ 環境変数設定済みでもdefaultプロファイルが読み込まれる

```kotlin
// Application.kt での強制設定
val springProfilesActive = System.getenv("SPRING_PROFILES_ACTIVE")
if (springProfilesActive != null) {
    System.setProperty("spring.profiles.active", springProfilesActive)
    app.setAdditionalProfiles(springProfilesActive)
}
```

### 6. Lambda環境変数の確認と調整
**確認項目**:
- DATABASE_HOST: ✅ 正しく設定
- DATABASE_PORT: ✅ 正しく設定
- DATABASE_NAME: ✅ 正しく設定
- SPRING_PROFILES_ACTIVE: ✅ "lambda"に設定済み

### 7. Lambdaリソース設定の最適化
```
Memory: 1024MB
Timeout: 60秒
```

## 根本原因の分析

### 1. ServiceLoader機構の問題
Lambda環境のJARファイル内で、R2DBC関連のServiceProviderが正しく認識されていない可能性。

### 2. Spring Cloud Function Adapterとの相性
Spring Cloud Function AdapterがR2DBC自動設定と正しく連携していない可能性。

### 3. クラスローディングの問題
Lambda環境特有のクラスローディング機構がR2DBCのプロバイダー検出を阻害している可能性。

## 検証済みの確認事項

### JARファイル内容確認
```bash
# ServiceLoaderメタデータの存在確認
unzip -l build/libs/shirogane-holy-knights-0.1.0-all.jar | grep "META-INF/services"

# 結果: io.r2dbc.spi.ConnectionFactoryProvider が正しく含まれていることを確認
META-INF/services/io.r2dbc.spi.ConnectionFactoryProvider
```

### 依存関係確認
- r2dbc-postgresql: ✅ 含まれている
- r2dbc-pool: ✅ 含まれている  
- spring-boot-starter-data-r2dbc: ✅ 含まれている

## 対応策の提案

### 短期的解決策
1. **JDBCへの一時的切り替え**
   - Spring Data JDBCを使用
   - 同期処理だがLambdaでは問題なし
   - 確実に動作する

2. **コンテナ化**
   - AWS Lambda Container Imageの使用
   - より制御可能な環境で実行

### 長期的解決策
1. **Serverless Frameworkへの移行**
   - Spring Cloud Function Adapterを使わない実装
   - 直接Lambda Handler実装

2. **GraalVM Native Imageの検討**
   - コールドスタート時間短縮
   - 依存関係の明確化

## 学んだ教訓

1. **Lambda環境固有の制約**: ローカルで動作してもLambdaで動作しない場合がある
2. **ServiceLoaderの脆弱性**: JARパッキングによってServiceLoaderが正しく動作しない場合がある
3. **プロファイル読み込みの複雑さ**: Spring Cloud Function Adapterはメインメソッドを直接呼び出さないため、プロファイル設定が困難
4. **デバッグの困難さ**: Lambda環境でのデバッグはCloudWatchログに依存し、時間がかかる

## 次のアクション

1. **Spring Data JDBCへの切り替え検討**
2. **Lambda Container Imageでの再実装検討**
3. **別のデプロイ方式（ECS Fargate等）の検討**

## 参考資料

- [Spring Cloud Function AWS Adapter](https://docs.spring.io/spring-cloud-function/docs/current/reference/html/aws.html)
- [R2DBC PostgreSQL Documentation](https://github.com/pgjdbc/r2dbc-postgresql)
- [AWS Lambda Java Runtime](https://docs.aws.amazon.com/lambda/latest/dg/lambda-java.html)
- [Shadow JAR Plugin](https://github.com/johnrengelman/shadow)

---
**作成者**: Claude Code Assistant  
**最終更新**: 2025年7月27日