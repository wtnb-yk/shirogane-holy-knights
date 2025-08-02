package com.shirogane.holy.knights.infrastructure.config

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass
import org.springframework.cloud.function.context.config.ContextFunctionCatalogAutoConfiguration
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import

/**
 * Spring Cloud Function設定クラス
 */
@Configuration
@ConditionalOnClass(name = ["org.springframework.cloud.function.context.FunctionCatalog"])
@Import(ContextFunctionCatalogAutoConfiguration::class)
class SpringCloudFunctionConfig