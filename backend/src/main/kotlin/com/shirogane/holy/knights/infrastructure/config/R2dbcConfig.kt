package com.shirogane.holy.knights.infrastructure.config

import io.r2dbc.postgresql.PostgresqlConnectionConfiguration
import io.r2dbc.postgresql.PostgresqlConnectionFactory
import io.r2dbc.pool.ConnectionPool
import io.r2dbc.pool.ConnectionPoolConfiguration
import io.r2dbc.spi.ConnectionFactory
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate
import org.springframework.data.r2dbc.dialect.PostgresDialect
import org.springframework.r2dbc.core.DatabaseClient
import java.time.Duration

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
            .preparedStatementCacheQueries(256)
            .fetchSize(256)

        val isLocalDev = host == "localhost" || host == "host.docker.internal" || host == "postgres"
        val isLambda = System.getenv("AWS_LAMBDA_FUNCTION_NAME") != null

        if (isLocalDev) {
            logger.info("Local development environment detected, SSL disabled for database connection")
        } else {
            logger.info("Production environment detected, enabling SSL for database connection")
            configuration.enableSsl()
        }

        val baseConnectionFactory = PostgresqlConnectionFactory(configuration.build())
        
        return if (isLambda) {
            logger.info("Lambda environment detected, configuring optimized connection pool")
            val poolConfiguration = ConnectionPoolConfiguration.builder(baseConnectionFactory)
                .name("lambda-r2dbc-pool")
                .initialSize(1)
                .maxSize(3)
                .maxIdleTime(Duration.ofMinutes(5))
                .maxCreateConnectionTime(Duration.ofSeconds(5))
                .acquireRetry(3)
                .validationQuery("SELECT 1")
                .build()
            ConnectionPool(poolConfiguration)
        } else {
            logger.info("Non-Lambda environment, configuring standard connection pool")
            val poolConfiguration = ConnectionPoolConfiguration.builder(baseConnectionFactory)
                .name("r2dbc-pool")
                .initialSize(5)
                .maxSize(20)
                .maxIdleTime(Duration.ofMinutes(30))
                .maxCreateConnectionTime(Duration.ofSeconds(10))
                .validationQuery("SELECT 1")
                .build()
            ConnectionPool(poolConfiguration)
        }
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
