import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.gradle.api.tasks.testing.logging.TestExceptionFormat

plugins {
    kotlin("jvm") version "1.9.22"
    kotlin("plugin.serialization") version "1.9.22"
    kotlin("plugin.spring") version "1.9.22"
    id("org.jetbrains.kotlin.plugin.allopen") version "1.9.22"
    id("org.springframework.boot") version "3.2.5"
    id("io.spring.dependency-management") version "1.1.4"
    id("com.github.johnrengelman.shadow") version "8.1.1"
    application
    id("org.graalvm.buildtools.native") version "0.9.28"
}

// Spring BootのAOT処理を無効化
tasks.withType<org.springframework.boot.gradle.tasks.aot.ProcessAot> {
    enabled = false
}

group = "com.shirogane.holy.knights"
version = "0.1.0"

repositories {
    mavenCentral()
    maven { url = uri("https://jitpack.io") }
}

val springCloudVersion = "2023.0.0"
val logbackVersion = "1.4.11"
val postgresqlVersion = "42.7.2"
val kotlinxCoroutinesVersion = "1.7.3"
val kotlinxSerializationVersion = "1.6.2"
val kotestVersion = "5.8.0"

dependencies {
    // Spring Boot
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-data-r2dbc")
    
    
    // Spring Cloud Function - AWS Lambda統合
    implementation("org.springframework.cloud:spring-cloud-function-context")
    implementation("org.springframework.cloud:spring-cloud-function-adapter-aws")
    implementation("com.amazonaws:aws-lambda-java-core:1.2.3")
    implementation("com.amazonaws:aws-lambda-java-events:3.11.4")
    
    // Database
    implementation("org.postgresql:r2dbc-postgresql:1.0.5.RELEASE")
    
    // Logging
    implementation("ch.qos.logback:logback-classic:$logbackVersion")
    
    // Serialization
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:$kotlinxSerializationVersion")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    
    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:$kotlinxCoroutinesVersion")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor:$kotlinxCoroutinesVersion")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-slf4j:$kotlinxCoroutinesVersion")
    
    // Testing
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework:spring-test")
    testImplementation("io.kotest:kotest-runner-junit5:$kotestVersion")
    testImplementation("io.kotest:kotest-assertions-core:$kotestVersion")
}

application {
    mainClass.set("com.shirogane.holy.knights.Application")
}

dependencyManagement {
    imports {
        mavenBom("org.springframework.cloud:spring-cloud-dependencies:${springCloudVersion}")
    }
}


allOpen {
    annotation("org.springframework.stereotype.Service")
    annotation("org.springframework.stereotype.Component")
    annotation("org.springframework.stereotype.Repository")
    annotation("org.springframework.stereotype.Controller")
    annotation("org.springframework.web.bind.annotation.RestController")
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        jvmTarget = "17"
        freeCompilerArgs = listOf("-Xjsr305=strict")
    }
}

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

tasks.withType<Test> {
    useJUnitPlatform()
    testLogging {
        events("passed", "skipped", "failed")
        exceptionFormat = TestExceptionFormat.FULL
        showExceptions = true
        showCauses = true
        showStackTraces = true
    }
}


// Spring Cloud Function AWS Lambda用JARタスク
val springCloudFunctionLambdaJar by tasks.registering(com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar::class) {
    archiveClassifier.set("aws-lambda")
    from(sourceSets.main.get().output)
    
    configurations = listOf(project.configurations.runtimeClasspath.get())
    
    manifest {
        attributes(
            "Main-Class" to "org.springframework.cloud.function.adapter.aws.FunctionInvoker",
            "Start-Class" to "com.shirogane.holy.knights.Application"
        )
    }
    
    mergeServiceFiles()
    exclude("META-INF/*.SF")
    exclude("META-INF/*.DSA") 
    exclude("META-INF/*.RSA")
}

// Liquibaseマイグレーション実行タスク（CI/CD用）
val liquibaseUpdate by tasks.registering(JavaExec::class) {
    group = "database"
    description = "Run Liquibase database migration"
    classpath = sourceSets.main.get().runtimeClasspath
    mainClass.set("liquibase.integration.commandline.Main")
    
    args = listOf(
        "--url=jdbc:postgresql://${System.getenv("DB_HOST") ?: "localhost:5432"}/${System.getenv("DB_NAME") ?: "shirogane"}",
        "--username=${System.getenv("DB_USER") ?: "postgres"}",
        "--password=${System.getenv("DB_PASSWORD") ?: "postgres"}",
        "--changeLogFile=src/main/resources/db/changelog/changelog.xml",
        "update"
    )
}

graalvmNative {
    binaries {
        named("main") {
            imageName.set("shirogane-holy-knights-api")
            mainClass.set("com.shirogane.holy.knights.Application")
            buildArgs.add("--no-fallback")
            buildArgs.add("-H:+ReportExceptionStackTraces")
        }
    }
}

// LocalStack環境用タスク
val localstackEndpoint = System.getenv("LOCALSTACK_ENDPOINT") ?: "http://localstack:4566"
val functionName = "shirogane-holy-knights-api"
val apiName = "shirogane-api"

// LocalStackの準備確認
val checkLocalStack by tasks.registering(Exec::class) {
    group = "localstack"
    description = "Check if LocalStack is running"
    commandLine("curl", "-f", "$localstackEndpoint/_localstack/health")
    isIgnoreExitValue = true
    
    doLast {
        if (executionResult.get().exitValue != 0) {
            throw GradleException("LocalStackが起動していません。docker compose up localstack -d を実行してください。")
        }
    }
}

// 既存Lambda関数の削除
val cleanLocalStackLambda by tasks.registering(Exec::class) {
    group = "localstack"
    description = "Clean existing Lambda function in LocalStack"
    dependsOn(checkLocalStack)
    
    environment("AWS_ACCESS_KEY_ID", "test")
    environment("AWS_SECRET_ACCESS_KEY", "test")
    environment("AWS_DEFAULT_REGION", "ap-northeast-1")
    
    commandLine("aws", "lambda", "delete-function", 
        "--function-name", functionName,
        "--endpoint-url", localstackEndpoint)
    isIgnoreExitValue = true
}

// クラスファイル展開用ディレクトリの準備
val prepareHotReloadDir by tasks.registering {
    group = "localstack"
    description = "Prepare hot reload directory"
    
    doLast {
        val hotDir = file("build/hot")
        hotDir.mkdirs()
        println("ホットリロード用ディレクトリ準備完了: ${hotDir.absolutePath}")
    }
}

// JAR展開タスク（ホットリロード用）
val extractJarForHotReload by tasks.registering(Copy::class) {
    group = "localstack"
    description = "Extract JAR for hot reload"
    dependsOn(springCloudFunctionLambdaJar, prepareHotReloadDir)
    
    from(zipTree(springCloudFunctionLambdaJar.get().archiveFile))
    into("build/hot")
    
    doLast {
        println("JAR展開完了: build/hot/")
    }
}

// Lambda関数の作成（ホットリロード対応）
val deployLocalStackLambda by tasks.registering(Exec::class) {
    group = "localstack"
    description = "Deploy Lambda function to LocalStack with hot reload"
    dependsOn(cleanLocalStackLambda, extractJarForHotReload)
    
    environment("AWS_ACCESS_KEY_ID", "test")
    environment("AWS_SECRET_ACCESS_KEY", "test") 
    environment("AWS_DEFAULT_REGION", "ap-northeast-1")
    
    val hotReloadDir = file("build/hot").absolutePath
    
    commandLine("aws", "lambda", "create-function",
        "--function-name", functionName,
        "--runtime", "java17",
        "--role", "arn:aws:iam::000000000000:role/lambda-role",
        "--handler", "org.springframework.cloud.function.adapter.aws.FunctionInvoker",
        "--code", "S3Bucket=hot-reload,S3Key=${hotReloadDir}",
        "--timeout", "300",
        "--memory-size", "512",
        "--environment", "Variables={SPRING_PROFILES_ACTIVE=lambda,DATABASE_HOST=host.docker.internal,DATABASE_PORT=5432,DATABASE_NAME=shirogane,DATABASE_USERNAME=postgres,DATABASE_PASSWORD=postgres,SPRING_CLOUD_FUNCTION_DEFINITION=apiGatewayFunction}",
        "--endpoint-url", localstackEndpoint)
    
    doLast {
        println("Lambda関数のホットリロードデプロイ完了: $functionName")
        println("監視対象ディレクトリ: $hotReloadDir")
    }
}

// API Gatewayの作成とデプロイ
val deployLocalStackApiGateway by tasks.registering(Exec::class) {
    group = "localstack"
    description = "Deploy API Gateway to LocalStack"
    dependsOn(deployLocalStackLambda)
    
    environment("AWS_ACCESS_KEY_ID", "test")
    environment("AWS_SECRET_ACCESS_KEY", "test")
    environment("AWS_DEFAULT_REGION", "ap-northeast-1")
    
    doLast {
        // API Gateway作成スクリプトを実行
        val createApiScript = project.file("../scripts/create-api-gateway.sh")
        exec {
            commandLine("bash", createApiScript.absolutePath)
            environment("FUNCTION_NAME", functionName)
            environment("LOCALSTACK_ENDPOINT", localstackEndpoint)
        }
    }
}

// LocalStack環境全体のセットアップ
val localStackDeploy by tasks.registering {
    group = "localstack"
    description = "Deploy complete Lambda environment to LocalStack"
    dependsOn(deployLocalStackApiGateway)
    
    doLast {
        println("========================================")
        println("LocalStack Lambda環境のデプロイ完了！")
        println("========================================")
        println("APIエンドポイント確認:")
        println("curl $localstackEndpoint/restapis/\$(aws apigateway get-rest-apis --endpoint-url=$localstackEndpoint --query 'items[0].id' --output text)/dev/_user_request_/health")
        println("")
        println("詳細は ./gradlew localStackInfo で確認できます")
    }
}

// 自動リビルド・展開タスク（ホットリロード用）
val autoRebuildForHotReload by tasks.registering {
    group = "localstack"
    description = "Auto rebuild and extract for hot reload"
    
    doLast {
        // コンパイル
        project.tasks.getByName("compileKotlin").actions.forEach { action ->
            action.execute(project.tasks.getByName("compileKotlin"))
        }
        
        // クラスファイルをホットリロードディレクトリにコピー
        val classesDir = file("build/classes/kotlin/main")
        val hotDir = file("build/hot")
        
        if (classesDir.exists()) {
            copy {
                from(classesDir)
                into("$hotDir/BOOT-INF/classes")
            }
            println("クラスファイル更新完了: ${hotDir.absolutePath}")
        }
    }
}

// ファイル監視とホットリロード
val watchAndHotReload by tasks.registering {
    group = "localstack"
    description = "Watch source files and hot reload Lambda"
    dependsOn(localStackDeploy)
    
    doLast {
        println("========================================")
        println("ホットリロード監視開始")
        println("========================================")
        println("Kotlinファイルの変更を監視中...")
        println("変更検知時に自動的にLambda関数を更新します")
        println("停止するには Ctrl+C を押してください")
        println("")
        
        // 簡易ファイル監視（実用的にはGradle continuous buildを使用）
        exec {
            commandLine("bash", "-c", """
                while true; do
                    if find src/main/kotlin -name "*.kt" -newer build/hot/BOOT-INF/classes 2>/dev/null | grep -q .; then
                        echo "\$(date): Kotlinファイルの変更を検知しました"
                        ./gradlew autoRebuildForHotReload --quiet
                        echo "\$(date): ホットリロード完了"
                    fi
                    sleep 2
                done
            """)
        }
    }
}

// Gradle Continuous Build統合
val hotReloadDev by tasks.registering {
    group = "localstack"
    description = "Start hot reload development mode"
    dependsOn(localStackDeploy)
    
    doLast {
        println("========================================")
        println("ホットリロード開発モード開始")
        println("========================================")
        println("別ターミナルで以下を実行してください:")
        println("cd backend && ./gradlew classes --continuous")
        println("")
        println("ファイル変更時に自動的にLambda関数が更新されます")
    }
}

// デプロイ情報の表示と環境変数ファイル生成
val localStackInfo by tasks.registering(Exec::class) {
    group = "localstack"
    description = "Show LocalStack deployment information and create env file"
    dependsOn(checkLocalStack)
    
    environment("AWS_ACCESS_KEY_ID", "test")
    environment("AWS_SECRET_ACCESS_KEY", "test")
    environment("AWS_DEFAULT_REGION", "ap-northeast-1")
    
    doLast {
        exec {
            commandLine("bash", "-c", """
                # シンプルなURLを使用（ベースパスマッピング設定済み）
                API_URL="$localstackEndpoint"
                
                # フロントエンド用の環境変数ファイルを生成
                echo "NEXT_PUBLIC_API_URL=${'$'}API_URL" > ../frontend/.env.local
                
                echo "========================================="
                echo "LocalStack Lambda環境情報"
                echo "========================================="
                echo "Lambda関数: $functionName"
                echo "API URL: ${'$'}API_URL"
                echo ""
                echo "利用可能なエンドポイント:"
                echo "  GET  ${'$'}API_URL/health"
                echo "  GET  ${'$'}API_URL/video-tags"
                echo "  GET  ${'$'}API_URL/stream-tags" 
                echo "  POST ${'$'}API_URL/videos" 
                echo "  POST ${'$'}API_URL/streams"
                echo "  POST ${'$'}API_URL/news"
                echo "  GET  ${'$'}API_URL/news/categories"
                echo ""
                echo "テスト例:"
                echo "curl ${'$'}API_URL/health"
                echo ""
                echo "フロントエンド用環境変数ファイル生成: frontend/.env.local"
            """)
        }
    }
}
