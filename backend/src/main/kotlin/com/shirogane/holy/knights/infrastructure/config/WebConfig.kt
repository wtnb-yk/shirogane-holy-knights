package com.shirogane.holy.knights.infrastructure.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication
import org.springframework.context.annotation.Profile

/**
 * Web設定
 * CORS設定やWebMVC設定を行う
 * 
 * MVCタイプのアプリケーションでのみ有効
 */
@Configuration
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.SERVLET)
class WebConfig : WebMvcConfigurer {

    /**
     * CORS設定
     */
    @Bean
    fun corsFilter(): CorsFilter {
        val source = UrlBasedCorsConfigurationSource()
        val config = CorsConfiguration()
        
        // 開発環境用のCORS設定
        config.addAllowedOriginPattern("*")
        config.addAllowedMethod("*")
        config.addAllowedHeader("*")
        config.addExposedHeader("*")
        
        // '*'を使用する場合はfalseにする必要がある
        config.allowCredentials = false
        config.maxAge = 3600L
        
        source.registerCorsConfiguration("/**", config)
        return CorsFilter(source)
    }
}