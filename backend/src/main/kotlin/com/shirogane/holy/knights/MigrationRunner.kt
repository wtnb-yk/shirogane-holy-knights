package com.shirogane.holy.knights

import io.r2dbc.postgresql.PostgresqlConnectionConfiguration
import io.r2dbc.postgresql.PostgresqlConnectionFactory
import kotlinx.coroutines.runBlocking
import name.nkonev.r2dbc.migrate.core.R2dbcMigrate
import org.slf4j.LoggerFactory

/**
 * r2dbc-migrateライブラリを使用したスタンドアロンマイグレーション実行ツール
 * CI/CDパイプラインでの使用を想定
 */
object MigrationRunner {
    private val logger = LoggerFactory.getLogger(MigrationRunner::class.java)

    @JvmStatic
    fun main(args: Array<String>) {
        logger.info("Starting database migration...")
        
        val host = System.getenv("DB_HOST") ?: throw IllegalArgumentException("DB_HOST environment variable is required")
        val port = System.getenv("DB_PORT")?.toIntOrNull() ?: 5432
        val database = System.getenv("DB_NAME") ?: throw IllegalArgumentException("DB_NAME environment variable is required")
        val username = System.getenv("DB_USER") ?: throw IllegalArgumentException("DB_USER environment variable is required")
        val password = System.getenv("DB_PASSWORD") ?: throw IllegalArgumentException("DB_PASSWORD environment variable is required")
        
        logger.info("Connecting to database: $host:$port/$database")
        
        try {
            // PostgreSQL R2DBC ConnectionFactoryを作成
            val connectionFactory = PostgresqlConnectionFactory(
                PostgresqlConnectionConfiguration.builder()
                    .host(host)
                    .port(port)
                    .database(database)
                    .username(username)
                    .password(password)
                    .enableSsl()
                    .sslMode(io.r2dbc.postgresql.client.SSLMode.REQUIRE)
                    .build()
            )
            
            // r2dbc-migrateを設定して実行
            val r2dbcMigrate = R2dbcMigrate.builder()
                .connectionFactory(connectionFactory)
                .resourcesPath("classpath:db/migration/*.sql")
                .transactional(true)
                .build()
            
            runBlocking {
                val migrationsApplied = r2dbcMigrate.migrate().awaitSingle()
                logger.info("Migration completed successfully. Applied migrations: $migrationsApplied")
            }
            
        } catch (e: Exception) {
            logger.error("Migration failed", e)
            System.exit(1)
        }
    }
}