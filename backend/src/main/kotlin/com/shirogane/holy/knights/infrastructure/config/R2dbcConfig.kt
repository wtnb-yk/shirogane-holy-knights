package com.shirogane.holy.knights.infrastructure.config

import io.r2dbc.postgresql.PostgresqlConnectionConfiguration
import io.r2dbc.postgresql.PostgresqlConnectionFactory
import io.r2dbc.spi.ConnectionFactory
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate
import org.springframework.data.r2dbc.dialect.PostgresDialect
import org.springframework.r2dbc.core.DatabaseClient

@Configuration
class R2dbcConfig() {

    private val logger = LoggerFactory.getLogger(R2dbcConfig::class.java)

    @Bean
    @Primary
    fun connectionFactory(): ConnectionFactory {
        val host = System.getenv("DATABASE_HOST") ?: "localhost"
        val port = System.getenv("DATABASE_PORT")?.toIntOrNull() ?: 5432
        val database = System.getenv("DATABASE_NAME") ?: "shirogane"
        val username = System.getenv("DATABASE_USERNAME") ?: "postgres"
        val password = System.getenv("DATABASE_PASSWORD") ?: "postgres"
        
        logger.info("Database connection config - Host: $host, Port: $port, Database: $database, Username: $username")

        val configuration = PostgresqlConnectionConfiguration.builder()
            .host(host)
            .port(port)
            .database(database)
            .username(username)
            .password(password)

        // ローカル開発環境かLambda+LocalStack環境を判定
        val isLambda = System.getenv("AWS_LAMBDA_FUNCTION_NAME") != null
        val isLocalDev = (host == "localhost" || host == "host.docker.internal" || host == "postgres") && !isLambda

        if (isLocalDev) {
            logger.info("Local development environment detected, SSL disabled for database connection")
            // ローカル開発環境の場合はSSLを無効にする
        } else {
            logger.info("Production environment detected, enabling SSL for database connection")
            configuration.enableSsl()
        }

        return PostgresqlConnectionFactory(configuration.build())
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
