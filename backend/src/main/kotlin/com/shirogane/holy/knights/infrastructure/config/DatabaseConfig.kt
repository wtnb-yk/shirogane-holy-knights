package com.shirogane.holy.knights.infrastructure.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.jdbc.DataSourceBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.jdbc.core.JdbcTemplate
import javax.sql.DataSource

/**
 * データベース接続設定
 * Spring Boot方式によるデータソース設定
 */
@Configuration
class DatabaseConfig {

    @Value("\${spring.datasource.url}")
    private lateinit var jdbcUrl: String

    @Value("\${spring.datasource.username}")
    private lateinit var username: String

    @Value("\${spring.datasource.password}")
    private lateinit var password: String

    @Value("\${spring.datasource.driver-class-name}")
    private lateinit var driverClassName: String

    /**
     * データソースの構成
     * HikariCPはSpring Boot経由で自動的に構成されるため、
     * 特別な設定が必要な場合のみカスタマイズする
     */
    @Bean
    fun dataSource(): DataSource {
        return DataSourceBuilder.create()
            .url(jdbcUrl)
            .username(username)
            .password(password)
            .driverClassName(driverClassName)
            .build()
    }

    /**
     * JdbcTemplateを提供
     * データベースとの対話を簡略化する
     */
    @Bean
    fun jdbcTemplate(dataSource: DataSource): JdbcTemplate {
        return JdbcTemplate(dataSource)
    }
}