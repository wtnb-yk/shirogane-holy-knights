package com.shirogane.holy.knights.infrastructure.config

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.cloud.function.context.config.ContextFunctionCatalogAutoConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import

/**
 * Spring Cloud Function設定クラス
 * Lambda環境でFunctionCatalogを確実に有効化する
 */
@Configuration
@ConditionalOnClass(name = ["org.springframework.cloud.function.context.FunctionCatalog"])
@Import(ContextFunctionCatalogAutoConfiguration::class)
class FunctionConfig {

    @Bean
    @ConditionalOnMissingBean
    fun objectMapper(): ObjectMapper {
        return ObjectMapper().registerKotlinModule()
    }
}