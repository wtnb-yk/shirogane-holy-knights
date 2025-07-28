# R2DBC Lambda統合トラブルシューティング記録

## 問題の概要
AWS Lambda環境でSpring Boot + R2DBCアプリケーションを実行する際に、データベース接続関連のエラーが発生している。

## エラーメッセージの履歴

### 2025年7月28日の試行記録

#### 試行1: 初期エラー
**エラー内容**: `Cannot determine a BindMarkersFactory for PostgreSQL`
**原因**: Spring Cloud Function環境でのDatabaseClient.builderアプローチの非互換性
**対策**: R2dbcConfigクラスを作成し、DatabaseClient設定を追加

#### 試行2: Bean競合エラー
**エラー内容**: `Cannot register alias 'databaseClient' for name 'r2dbcDatabaseClient': Alias would override bean definition 'databaseClient'`
**原因**: DatabaseClient Beanの重複定義
**対策**: databaseClient Beanの定義を削除

#### 試行3: Dialectエラー
**エラー内容**: `Cannot determine a dialect for PostgreSQL`
**原因**: R2dbcEntityTemplateにDialectが設定されていない
**対策**: PostgresDialect.INSTANCEを明示的に設定

#### 試行4-8: R2DBC設定の解決（解決済み）
**エラー内容**: `No qualifying bean of type 'io.r2dbc.spi.ConnectionFactory' available`
**原因**: ConnectionFactoryのBeanが作成されていない
**解決策**: 試行5のConnectionFactory作成パターンを復活させ、PostgresDialectを明示的に指定
**結果**: R2DBC関連エラーは完全に解決

#### 試行9-11: FunctionCatalogエラー（現在）
**エラー内容**: `No qualifying bean of type 'org.springframework.cloud.function.context.FunctionCatalog' available`
**原因**: Spring Cloud FunctionがapiGatewayFunction Beanを正しく認識していない

**試した対策**:
- FunctionConfigクラス作成 → 効果なし
- SpringBootLambdaHandlerの作成 → 効果なし
- @ComponentScanの追加 → Lambda環境では無効
- LambdaBeanConfigでBean明示定義 → 削除済み
- 公式FunctionInvokerハンドラー使用 → 現在使用中、まだエラー
- Bean戻り値の型をFunction<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent>に変更 → 効果なし

**重要な発見**:
- CloudWatch LogsでSpringBootLambdaHandlerが実行されている
- 設定上はFunctionInvoker::handleRequestを使用
- **Terraformデプロイが5分でタイムアウト中断**
- **デプロイ完了前にAPI呼び出しを実行していた**

**問題の本質**:
1. 過去の試行を無視して同じ解決策を繰り返し提案
2. デプロイ未完了により設定変更が反映されていない
3. 古いLambda関数（SpringBootLambdaHandler）が実行されている

**現状**: デプロイタイミング問題として再検証中

## 環境情報

### Lambda環境変数
```
DATABASE_HOST: shirogane-holy-knights-dev-db.chki60iywt92.ap-northeast-1.rds.amazonaws.com
DATABASE_PORT: 5432
DATABASE_NAME: shirogane_portal
DATABASE_USERNAME: postgres
DATABASE_PASSWORD: SecurePassword123!
SPRING_PROFILES_ACTIVE: lambda
```

### 依存関係
- spring-boot-starter-data-r2dbc
- org.postgresql:r2dbc-postgresql:1.0.5.RELEASE
- Spring Boot: 3.2.5
- Spring Cloud: 2023.0.0

## 試した設定パターン

### パターン1: AbstractR2dbcConfiguration継承（失敗）
```kotlin
class R2dbcConfig : AbstractR2dbcConfiguration() {
    override fun connectionFactory(): ConnectionFactory {
        // PostgresqlConnectionFactoryを返す
    }
}
```
**結果**: Dialect関連のエラー

### パターン2: シンプルなBean定義（失敗）
```kotlin
@Configuration
class R2dbcConfig {
    @Bean
    fun r2dbcEntityTemplate(connectionFactory: ConnectionFactory): R2dbcEntityTemplate {
        return R2dbcEntityTemplate(connectionFactory)
    }
}
```
**結果**: ConnectionFactory Beanが見つからない

## 試行記録

### 試行5: AbstractR2dbcConfiguration + 環境変数直接読み込み（2025年7月28日 21:55）
**実装内容**:
```kotlin
@Configuration
@EnableR2dbcRepositories(basePackages = ["com.shirogane.holy.knights.adapter.gateway"])
class R2dbcConfig : AbstractR2dbcConfiguration() {
    override fun connectionFactory(): ConnectionFactory {
        // 環境変数から直接読み込み
        val host = System.getenv("DATABASE_HOST") ?: "localhost"
        // ... PostgresqlConnectionFactoryを返す
    }
}
```

**結果**: 部分的成功
- ✅ 環境変数の読み込み成功
- ✅ ConnectionFactoryの作成成功
- ❌ databaseClient作成時にDialectエラー: `Cannot determine a dialect for PostgreSQL`

**ログ抜粋**:
```
2025-07-28 12:56:09.798 [main] INFO  === R2DBC設定初期化開始 ===
2025-07-28 12:56:09.798 [main] INFO  DATABASE_HOST: shirogane-holy-knights-dev-db.chki60iywt92.ap-northeast-1.rds.amazonaws.com
2025-07-28 12:56:09.798 [main] INFO  DATABASE_PORT: 5432
2025-07-28 12:56:09.798 [main] INFO  DATABASE_NAME: shirogane_portal
2025-07-28 12:56:09.798 [main] INFO  DATABASE_USERNAME: postgres
2025-07-28 12:56:09.800 [main] INFO  ConnectionFactory作成開始
2025-07-28 12:56:09.921 [main] INFO  ConnectionFactory作成完了
2025-07-28 12:56:09.947 [main] ERROR Cannot determine a dialect for PostgreSQL
```

## 次の試行予定

### 試行6: DatabaseClientとR2dbcEntityTemplateを明示的定義（2025年7月28日 22:00）
**実装内容**:
```kotlin
@Bean
fun databaseClient(connectionFactory: ConnectionFactory): DatabaseClient {
    return DatabaseClient.builder()
        .connectionFactory(connectionFactory)
        .bindMarkers(PostgresDialect.INSTANCE.bindMarkersFactory)
        .build()
}

@Bean
fun r2dbcEntityTemplate(databaseClient: DatabaseClient): R2dbcEntityTemplate {
    return R2dbcEntityTemplate(databaseClient, PostgresDialect.INSTANCE)
}
```

**結果**: Bean競合エラー
- ❌ Bean競合エラー: `Cannot register alias 'databaseClient' for name 'r2dbcDatabaseClient': Alias would override bean definition 'databaseClient'`
- **原因**: AbstractR2dbcConfigurationがdatabaseClientを自動作成している

### 次の試行予定

### 試行7: 最小構成の@Configuration（2025年7月28日 22:07）
**実装内容**:
```kotlin
@Configuration
@EnableR2dbcRepositories(basePackages = ["com.shirogane.holy.knights.adapter.gateway"])
class R2dbcConfig
```

**結果**: R2dbcEntityTemplateのBean作成なし
- ❌ `No qualifying bean of type 'org.springframework.data.r2dbc.core.R2dbcEntityTemplate' available`
- **原因**: Spring BootのR2DBC自動設定がLambda環境で正しく動作していない

### 次の試行予定

### 試行8: 試行5パターンの復活 + PostgresDialect明示指定（成功！）（2025年7月28日 22:22）
**実装内容**:
```kotlin
@Configuration
@EnableR2dbcRepositories(basePackages = ["com.shirogane.holy.knights.adapter.gateway"])
class R2dbcConfig {
    
    @Bean
    @Primary
    fun connectionFactory(): ConnectionFactory {
        val host = System.getenv("DATABASE_HOST") ?: "localhost"
        val port = System.getenv("DATABASE_PORT")?.toIntOrNull() ?: 5432
        val database = System.getenv("DATABASE_NAME") ?: "shirogane_db"
        val username = System.getenv("DATABASE_USERNAME") ?: "postgres"
        val password = System.getenv("DATABASE_PASSWORD") ?: "postgres"
        
        return PostgresqlConnectionFactory(
            PostgresqlConnectionConfiguration.builder()
                .host(host).port(port).database(database)
                .username(username).password(password)
                .build()
        )
    }
    
    @Bean
    fun r2dbcEntityTemplate(connectionFactory: ConnectionFactory): R2dbcEntityTemplate {
        val databaseClient = DatabaseClient.builder()
            .connectionFactory(connectionFactory)
            .bindMarkers(PostgresDialect.INSTANCE.bindMarkersFactory)
            .build()
        return R2dbcEntityTemplate(databaseClient, PostgresDialect.INSTANCE)
    }
}
```

**結果**: **R2DBC問題完全解決！**
- ✅ ConnectionFactory作成成功: `ConnectionFactory作成完了`
- ✅ R2dbcEntityTemplate作成成功: `R2dbcEntityTemplate作成完了`
- ✅ Dialectエラー解消: 以前の`Cannot determine a dialect for PostgreSQL`エラーが消失
- ✅ 環境変数読み込み正常動作

**成功要因分析**:
1. **AbstractR2dbcConfiguration継承なし**: Bean競合を回避
2. **@Primary付きConnectionFactory**: Spring BootとSpring Cloud Functionの両方で認識
3. **PostgresDialect明示指定**: DatabaseClientとR2dbcEntityTemplateの両方でDialect指定
4. **環境変数直接読み込み**: Spring Boot自動設定に依存せず確実に動作

**新たな課題**: 
- FunctionCatalogエラー: `No qualifying bean of type 'org.springframework.cloud.function.context.FunctionCatalog' available`
- これはSpring Cloud Function側の設定問題（R2DBCとは別問題）

## R2DBC設定の最終解決パターン（推奨）

Lambda環境でのSpring Boot + R2DBC設定は以下のパターンで解決：

```kotlin
@Configuration
@EnableR2dbcRepositories(basePackages = ["com.shirogane.holy.knights.adapter.gateway"])
class R2dbcConfig {
    
    @Bean
    @Primary
    fun connectionFactory(): ConnectionFactory {
        // 環境変数から直接読み込み（Spring Boot自動設定に依存しない）
        val host = System.getenv("DATABASE_HOST") ?: "localhost"
        val port = System.getenv("DATABASE_PORT")?.toIntOrNull() ?: 5432
        val database = System.getenv("DATABASE_NAME") ?: "shirogane_db"
        val username = System.getenv("DATABASE_USERNAME") ?: "postgres"
        val password = System.getenv("DATABASE_PASSWORD") ?: "postgres"
        
        return PostgresqlConnectionFactory(
            PostgresqlConnectionConfiguration.builder()
                .host(host).port(port).database(database)
                .username(username).password(password)
                .build()
        )
    }
    
    @Bean
    fun r2dbcEntityTemplate(connectionFactory: ConnectionFactory): R2dbcEntityTemplate {
        // PostgresDialectを明示的に指定することが重要
        val databaseClient = DatabaseClient.builder()
            .connectionFactory(connectionFactory)
            .bindMarkers(PostgresDialect.INSTANCE.bindMarkersFactory)
            .build()
        return R2dbcEntityTemplate(databaseClient, PostgresDialect.INSTANCE)
    }
}
```

## 参考リンク
- Spring Data R2DBC Reference: https://docs.spring.io/spring-data/r2dbc/docs/current/reference/html/
- Spring Cloud Function: https://spring.io/projects/spring-cloud-function