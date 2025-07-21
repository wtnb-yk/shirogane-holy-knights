package com.shirogane.holy.knights.infrastructure.config

import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.web.reactive.config.CorsRegistry
import org.springframework.web.reactive.config.EnableWebFlux
import org.springframework.web.reactive.config.WebFluxConfigurer
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication

/**
 * Spring Cloud Function WebFlux用の追加CORS設定
 * 
 * WebFluxConfigurer を実装して、直接 CorsRegistry を設定します。
 * これにより、WebFlux ベースのエンドポイントでもCORSが正しく動作します。
 * 
 * lambda-local プロファイル時のみ有効になります。
 */
@Configuration
@EnableWebFlux
@Profile("lambda-local")
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.REACTIVE)
class FunctionCorsConfiguration : WebFluxConfigurer {

    /**
     * CORS設定を登録
     */
    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/**")
            .allowedOrigins("*") // 開発環境なので全てのオリジンを許可
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .exposedHeaders("*")
            .allowCredentials(false) // '*'を使う場合はfalseにする必要がある
            .maxAge(3600)
    }
}