package com.shirogane.holy.knights.infrastructure.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

/**
 * Web設定
 * CORS設定やWebMVC設定を行う
 */
@Configuration
class WebConfig : WebMvcConfigurer {

    @Value("\${cors.allowed-origins:http://localhost:3000}")
    private lateinit var allowedOrigins: String

    @Value("\${cors.allowed-methods:GET,POST,PUT,DELETE,OPTIONS}")
    private lateinit var allowedMethods: String

    @Value("\${cors.allowed-headers:Content-Type,Authorization}")
    private lateinit var allowedHeaders: String

    /**
     * CORS設定
     */
    @Bean
    fun corsFilter(): CorsFilter {
        val source = UrlBasedCorsConfigurationSource()
        val config = CorsConfiguration()
        
        // フロントエンドURLを環境変数から取得
        val origins = allowedOrigins.split(",").toTypedArray()
        config.allowedOrigins = origins.toList()
        
        // メソッドとヘッダーの設定
        config.allowedMethods = allowedMethods.split(",").toList()
        config.allowedHeaders = allowedHeaders.split(",").toList()
        
        // 本番環境ではより厳格に設定
        if (System.getenv("ENV") == "production") {
            config.allowCredentials = true
            config.maxAge = 3600L
        }
        
        source.registerCorsConfiguration("/**", config)
        return CorsFilter(source)
    }
}