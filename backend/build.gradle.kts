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
val logbackVersion = "1.5.13"
val kotlinxCoroutinesVersion = "1.7.3"
val kotlinxSerializationVersion = "1.6.2"
val kotestVersion = "5.8.0"
val arrowVersion = "1.2.4"
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
    archiveClassifier.set("springboot-lambda")
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






