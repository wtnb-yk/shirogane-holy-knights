package com.shirogane.holy.knights.infrastructure.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.reactive.CorsWebFilter
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource
import org.springframework.web.reactive.config.WebFluxConfigurer

/**
 * WebFlux設定
 * CORS設定やReactiveルーティング設定を行う
 */
@Configuration
class WebConfig : WebFluxConfigurer {

    /**
     * CORS設定
     */
    @Bean
    fun corsFilter(): CorsWebFilter {
        val config = CorsConfiguration()
        
        // 開発環境用のCORS設定
        config.addAllowedOriginPattern("*")
        config.addAllowedMethod("*")
        config.addAllowedHeader("*")
        config.addExposedHeader("*")
        
        // '*'を使用する場合はfalseにする必要がある
        config.allowCredentials = false
        config.maxAge = 3600L
        
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", config)
        
        return CorsWebFilter(source)
    }
}