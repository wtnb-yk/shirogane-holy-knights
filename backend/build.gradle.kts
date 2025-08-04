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
    implementation("org.springframework.boot:spring-boot-starter-validation")
    
    
    // Spring Cloud Function - AWS Lambda統合
    implementation("org.springframework.cloud:spring-cloud-function-context")
    implementation("org.springframework.cloud:spring-cloud-function-adapter-aws")
    implementation("org.springframework.cloud:spring-cloud-function-web")
    implementation("com.amazonaws:aws-lambda-java-core:1.2.3")
    implementation("com.amazonaws:aws-lambda-java-events:3.11.4")
    
    // Database
    implementation("org.postgresql:r2dbc-postgresql:1.0.5.RELEASE")
    implementation("org.postgresql:postgresql:$postgresqlVersion")
    
    // Liquibase Migration
    implementation("org.liquibase:liquibase-core:4.24.0")
    
    // Logging
    implementation("ch.qos.logback:logback-classic:$logbackVersion")
    
    // Serialization
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:$kotlinxSerializationVersion")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    
    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:$kotlinxCoroutinesVersion")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor:$kotlinxCoroutinesVersion")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-slf4j:$kotlinxCoroutinesVersion")
    
    // Spring Test (for reactive testing)
    implementation("org.springframework:spring-test")
    
    // Testing
    testImplementation("org.springframework.boot:spring-boot-starter-test")
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
        "--url=jdbc:postgresql://${System.getenv("DB_HOST") ?: "localhost:5432"}/${System.getenv("DB_NAME") ?: "shirogane_db"}",
        "--username=${System.getenv("DB_USER") ?: "postgres"}",
        "--password=${System.getenv("DB_PASSWORD") ?: "postgres"}",
        "--searchPath=src/main/resources",
        "--changeLogFile=db/changelog/changelog.xml",
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
