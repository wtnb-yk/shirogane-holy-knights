import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.gradle.api.tasks.testing.logging.TestExceptionFormat

plugins {
    kotlin("jvm") version "1.9.22"
    kotlin("plugin.serialization") version "1.9.22"
    kotlin("plugin.spring") version "1.9.22"
    id("org.jetbrains.kotlin.plugin.allopen") version "1.9.22"
    id("org.springframework.boot") version "3.2.5"
    id("io.spring.dependency-management") version "1.1.4"
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

val springBootVersion = "3.2.5"
val springCloudVersion = "2023.0.0"
val logbackVersion = "1.4.11"
val postgresqlVersion = "42.7.2"
val kotlinxCoroutinesVersion = "1.7.3"
val kotlinxSerializationVersion = "1.6.2"
val kotestVersion = "5.8.0"

dependencies {
    // Spring Boot
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-jdbc")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    
    // Flyway for DB migrations
    implementation("org.flywaydb:flyway-core")
    
    // Spring Cloud
    implementation("org.springframework.cloud:spring-cloud-function-web")
    
    // AWS Lambda用の依存関係
    implementation("org.springframework.cloud:spring-cloud-function-adapter-aws")
    implementation("org.springframework.cloud:spring-cloud-starter-function-web")
    implementation("com.amazonaws:aws-lambda-java-core:1.2.3")
    implementation("com.amazonaws:aws-lambda-java-events:3.11.4")
    
    // Database
    implementation("org.postgresql:postgresql:$postgresqlVersion")
    
    // Logging
    implementation("ch.qos.logback:logback-classic:$logbackVersion")
    
    // Serialization
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:$kotlinxSerializationVersion")
    
    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:$kotlinxCoroutinesVersion")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor:$kotlinxCoroutinesVersion")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-slf4j:$kotlinxCoroutinesVersion")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-debug:$kotlinxCoroutinesVersion")
    
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
