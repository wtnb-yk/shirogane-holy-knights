package com.shirogane.holy.knights.infrastructure.config

import io.r2dbc.postgresql.PostgresqlConnectionConfiguration
import io.r2dbc.postgresql.PostgresqlConnectionFactory
import io.r2dbc.spi.ConnectionFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate
import org.springframework.r2dbc.core.DatabaseClient
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories
import org.springframework.data.r2dbc.dialect.PostgresDialect

/**
 * データベース接続設定
 * Spring Data R2DBC方式によるリアクティブデータソース設定
 * Bean競合を回避するため独立した設定
 */
@Configuration
@EnableR2dbcRepositories
class DatabaseConfig {

    @Value("\${R2DBC_DATABASE_HOST:localhost}")
    private lateinit var host: String

    @Value("\${R2DBC_DATABASE_PORT:5432}")
    private var port: Int = 5432

    @Value("\${R2DBC_DATABASE_NAME:shirogane_db}")
    private lateinit var database: String

    @Value("\${R2DBC_DATABASE_USERNAME:postgres}")
    private lateinit var username: String

    @Value("\${R2DBC_DATABASE_PASSWORD:postgres}")
    private lateinit var password: String

    /**
     * R2DBC接続ファクトリの構成
     * リアクティブなデータベース接続を提供
     */
    @Bean
    @Primary
    fun postgresConnectionFactory(): ConnectionFactory {
        return PostgresqlConnectionFactory(
            PostgresqlConnectionConfiguration.builder()
                .host(host)
                .port(port)
                .database(database)
                .username(username)
                .password(password)
                .build()
        )
    }

    /**
     * DatabaseClient Bean
     * PostgreSQL方言を明示的に設定
     */
    @Bean
    @Primary
    fun postgresqlDatabaseClient(): DatabaseClient {
        return DatabaseClient.builder()
            .connectionFactory(postgresConnectionFactory())
            .namedParameters(true)
            .build()
    }

    /**
     * R2dbcEntityTemplate Bean
     * PostgreSQL方言を明示的に設定
     */
    @Bean
    @Primary
    fun postgresqlR2dbcEntityTemplate(): R2dbcEntityTemplate {
        return R2dbcEntityTemplate(postgresqlDatabaseClient(), PostgresDialect.INSTANCE)
    }
}