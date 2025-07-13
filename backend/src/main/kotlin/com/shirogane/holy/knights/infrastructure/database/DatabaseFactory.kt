package com.shirogane.holy.knights.infrastructure.database

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.slf4j.LoggerFactory
import java.sql.Connection

/**
 * データベース接続ファクトリー
 * HikariCP接続プールを使用してPostgreSQLへの接続を管理
 */
object DatabaseFactory {
    private val logger = LoggerFactory.getLogger(DatabaseFactory::class.java)
    private lateinit var dataSource: HikariDataSource
    
    /**
     * データベース接続の初期化
     */
    fun init() {
        logger.info("データベース接続プールを初期化します")
        
        // 環境変数から設定を読み取り、デフォルト値で補完
        val jdbcUrl = System.getenv("JDBC_DATABASE_URL") ?: "jdbc:postgresql://localhost:5432/shirogane_db"
        val username = System.getenv("JDBC_DATABASE_USERNAME") ?: "postgres"
        val password = System.getenv("JDBC_DATABASE_PASSWORD") ?: "postgres"
        val maxPoolSize = System.getenv("JDBC_DATABASE_MAX_POOL_SIZE")?.toIntOrNull() ?: 3
        
        try {
            val config = HikariConfig().apply {
                this.jdbcUrl = jdbcUrl
                this.username = username
                this.password = password
                maximumPoolSize = maxPoolSize
                isAutoCommit = false
                transactionIsolation = "TRANSACTION_REPEATABLE_READ"
                validate()
            }
            
            dataSource = HikariDataSource(config)
            logger.info("データベース接続プールの初期化に成功しました")
        } catch (e: Exception) {
            logger.error("データベース接続プールの初期化に失敗しました", e)
            throw e
        }
    }
    
    /**
     * データベース操作を実行するユーティリティ関数
     * @param block 実行するデータベース操作
     * @return ブロックの戻り値
     */
    suspend fun <T> dbQuery(block: (Connection) -> T): T = 
        withContext(Dispatchers.IO) {
            dataSource.connection.use { connection ->
                try {
                    val result = block(connection)
                    connection.commit()
                    result
                } catch (e: Exception) {
                    connection.rollback()
                    throw e
                }
            }
        }
    
    /**
     * リソース解放
     */
    fun close() {
        logger.info("データベース接続プールをクローズします")
        if (::dataSource.isInitialized) {
            dataSource.close()
        }
    }
}