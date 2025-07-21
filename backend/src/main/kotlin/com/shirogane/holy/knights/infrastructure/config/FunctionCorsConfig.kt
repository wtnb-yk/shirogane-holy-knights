package com.shirogane.holy.knights.infrastructure.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.reactive.CorsWebFilter
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication

/**
 * Spring Cloud Function用のCORS設定
 *
 * WebFluxベースのAPIエンドポイント（Spring Cloud Function）用のCORS設定。
 * 通常のSpring MVCとは別に設定が必要。
 * 
 * lambda-localプロファイルのみで有効。
 */
@Configuration
@Profile("lambda-local")
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.REACTIVE)
class FunctionCorsConfig {

    /**
     * Spring Cloud Function用のCORS WebFilterを設定
     */
    @Bean
    fun corsWebFilter(): CorsWebFilter {
        val corsConfig = CorsConfiguration().applyPermitDefaultValues()
        
        // すべてのオリジンを許可（開発環境）
        corsConfig.addAllowedOriginPattern("*")
        corsConfig.addAllowedMethod("*")
        corsConfig.addAllowedHeader("*")
        corsConfig.addExposedHeader("*")
        
        // '*'を使用する場合はallowCredentialsをfalseにする必要がある
        corsConfig.allowCredentials = false
        corsConfig.maxAge = 3600L
        
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", corsConfig)
        return CorsWebFilter(source)
    }
}