package com.shirogane.holy.knights.infrastructure.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.reactive.CorsConfigurationSource
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource
import org.springframework.web.reactive.config.CorsRegistry
import org.springframework.web.reactive.config.EnableWebFlux
import org.springframework.web.reactive.config.WebFluxConfigurer

/**
 * CORS設定クラス
 * 
 * Spring WebFluxおよびSpring Cloud Functionの両方に対応した統合CORS設定。
 * プロファイルに基づいて異なるCORS設定を適用する。
 */
@Configuration
@EnableWebFlux
class CorsConfig : WebFluxConfigurer {

    // 通常環境向けの設定値
    @Value("\${spring.webflux.cors.allowed-origins:http://localhost:3000}")
    private lateinit var defaultAllowedOrigins: String
    
    @Value("\${spring.webflux.cors.allowed-methods:GET,POST,PUT,DELETE,OPTIONS}")
    private lateinit var defaultAllowedMethods: String
    
    @Value("\${spring.webflux.cors.allowed-headers:Content-Type,Authorization}")
    private lateinit var defaultAllowedHeaders: String
    
    @Value("\${spring.webflux.cors.max-age:3600}")
    private var defaultMaxAge: Long = 3600

    // lambda-local環境向けの設定値
    @Value("\${cors.allowed-origins:*}")
    private lateinit var lambdaAllowedOrigins: String
    
    @Value("\${cors.allowed-methods:GET,POST,PUT,DELETE,OPTIONS}")
    private lateinit var lambdaAllowedMethods: String
    
    @Value("\${cors.allowed-headers:*}")
    private lateinit var lambdaAllowedHeaders: String

    /**
     * WebFlux向けCORS設定
     */
    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/**")
            .allowedOriginPatterns("*")  // すべてのオリジンを許可
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .maxAge(3600)
    }

    /**
     * CORSフィルター（共通）
     */
    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val config = CorsConfiguration()
        val isLambdaLocal = isLambdaLocalProfile()
        
        // プロファイルに応じた設定値を適用
        if (isLambdaLocal) {
            // lambda-localプロファイル用の設定
            if (lambdaAllowedOrigins == "*") {
                config.addAllowedOriginPattern("*")
            } else {
                config.allowedOrigins = lambdaAllowedOrigins.split(",")
            }
            config.allowedMethods = lambdaAllowedMethods.split(",")
            config.allowedHeaders = lambdaAllowedHeaders.split(",")
            config.addExposedHeader("*")
            config.allowCredentials = false  // '*'を使う場合はfalseにする必要がある
        } else {
            // 通常プロファイル用の設定
            config.allowedOrigins = defaultAllowedOrigins.split(",")
            config.allowedMethods = defaultAllowedMethods.split(",")
            config.allowedHeaders = defaultAllowedHeaders.split(",")
            config.allowCredentials = true
        }
        
        config.maxAge = defaultMaxAge
        
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", config)
        return source
    }
    
    /**
     * 現在のプロファイルがlambda-localかどうかを確認
     */
    private fun isLambdaLocalProfile(): Boolean {
        val env = System.getenv("SPRING_PROFILES_ACTIVE") ?: ""
        return env.contains("lambda-local")
    }
}
