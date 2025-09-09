import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.gradle.api.tasks.testing.logging.TestExceptionFormat

plugins {
    kotlin("jvm") version "2.0.21"
    kotlin("plugin.serialization") version "2.0.21"
    kotlin("plugin.spring") version "2.0.21"
    id("org.jetbrains.kotlin.plugin.allopen") version "2.0.21"
    id("org.springframework.boot") version "3.4.1"
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

val springCloudVersion = "2024.0.0"
val logbackVersion = "1.5.13"
val kotlinxCoroutinesVersion = "1.9.0"
val kotlinxSerializationVersion = "1.8.0"
val kotestVersion = "5.9.1"
val arrowVersion = "2.0.0"
val nettyVersion = "4.1.124.Final"
val commonsLang3Version = "3.18.0"

dependencies {
    // 脆弱性対応: 推移的依存関係の強制的バージョン指定
    implementation("io.netty:netty-handler:$nettyVersion")
    implementation("io.netty:netty-common:$nettyVersion")
    implementation("org.apache.commons:commons-lang3:$commonsLang3Version")
    
    // Spring Boot (Web層削除、Lambda専用構成)
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-data-r2dbc")
    
    
    // Spring Cloud Function - AWS Lambda統合
    implementation("org.springframework.cloud:spring-cloud-function-context")
    implementation("org.springframework.cloud:spring-cloud-function-adapter-aws")
    implementation("com.amazonaws:aws-lambda-java-core:1.2.3")
    implementation("com.amazonaws:aws-lambda-java-events:3.11.4")
    
    // Database
    implementation("org.postgresql:r2dbc-postgresql:1.0.5.RELEASE")
    implementation("org.postgresql:postgresql:42.7.2")
    
    // Liquibase Migration
    implementation("org.liquibase:liquibase-core:4.31.0")
    
    // Logging
    implementation("ch.qos.logback:logback-classic:$logbackVersion")
    implementation("ch.qos.logback:logback-core:$logbackVersion")
    
    // Serialization
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:$kotlinxSerializationVersion")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310")
    
    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:$kotlinxCoroutinesVersion")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor:$kotlinxCoroutinesVersion")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-slf4j:$kotlinxCoroutinesVersion")
    
    // Arrow-kt
    implementation("io.arrow-kt:arrow-core:$arrowVersion")
    implementation("io.arrow-kt:arrow-fx-coroutines:$arrowVersion")
    
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
val localstackEndpoint = System.getenv("LOCALSTACK_ENDPOINT") ?: "http://localhost:4567"
val functionName = "shirogane-holy-knights-api"

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

// LocalStack情報表示
val localStackInfo by tasks.registering(Exec::class) {
    group = "localstack"
    description = "Show LocalStack deployment info"
    dependsOn(checkLocalStack)
    
    environment("AWS_ACCESS_KEY_ID", "test")
    environment("AWS_SECRET_ACCESS_KEY", "test")
    environment("AWS_DEFAULT_REGION", "ap-northeast-1")
    
    commandLine("aws", "lambda", "get-function", 
        "--function-name", functionName,
        "--endpoint-url", localstackEndpoint)
    isIgnoreExitValue = true
}

// Lambda関数の作成（通常JAR配置方式）
val deployLocalStackLambda by tasks.registering(Exec::class) {
    group = "localstack"
    description = "Deploy Lambda function to LocalStack"
    dependsOn(cleanLocalStackLambda, springCloudFunctionLambdaJar)
    
    environment("AWS_ACCESS_KEY_ID", "test")
    environment("AWS_SECRET_ACCESS_KEY", "test") 
    environment("AWS_DEFAULT_REGION", "ap-northeast-1")
    
    commandLine("aws", "lambda", "create-function",
        "--function-name", functionName,
        "--runtime", "java17",
        "--role", "arn:aws:iam::000000000000:role/lambda-role",
        "--handler", "org.springframework.cloud.function.adapter.aws.FunctionInvoker",
        "--zip-file", "fileb://${springCloudFunctionLambdaJar.get().archiveFile.get().asFile.absolutePath}",
        "--timeout", "300",
        "--memory-size", "512",
        "--environment", "Variables={SPRING_PROFILES_ACTIVE=lambda,DATABASE_HOST=host.docker.internal,DATABASE_PORT=5432,DATABASE_NAME=shirogane,DATABASE_USERNAME=postgres,DATABASE_PASSWORD=postgres,SPRING_CLOUD_FUNCTION_DEFINITION=apiGatewayFunction}",
        "--endpoint-url", localstackEndpoint)
    
    doLast {
        println("Lambda関数のデプロイ完了: $functionName")
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


