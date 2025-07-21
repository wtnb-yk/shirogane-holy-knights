package com.shirogane.holy.knights.infrastructure.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.reactive.CorsWebFilter
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource
import org.springframework.web.reactive.config.WebFluxConfigurer

@Configuration
class WebConfig : WebFluxConfigurer {

    @Value("\${spring.webflux.cors.allowed-origins:http://localhost:3000}")
    private lateinit var allowedOrigins: String
    
    @Value("\${spring.webflux.cors.allowed-methods:GET,POST,PUT,DELETE,OPTIONS}")
    private lateinit var allowedMethods: String
    
    @Value("\${spring.webflux.cors.allowed-headers:Content-Type,Authorization}")
    private lateinit var allowedHeaders: String
    
    @Value("\${spring.webflux.cors.max-age:3600}")
    private var maxAge: Long = 3600

    @Bean
    fun corsFilter(): CorsWebFilter {
        val config = CorsConfiguration()
        
        // application.ymlからの設定を使用
        config.allowedOrigins = allowedOrigins.split(",")
        config.allowedMethods = allowedMethods.split(",")
        config.allowedHeaders = allowedHeaders.split(",")
        config.maxAge = maxAge
        
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", config)
        
        return CorsWebFilter(source)
    }
}