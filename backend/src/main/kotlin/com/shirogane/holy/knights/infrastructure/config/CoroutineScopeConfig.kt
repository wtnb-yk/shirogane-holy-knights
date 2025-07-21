package com.shirogane.holy.knights.infrastructure.config

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

/**
 * コルーチンスコープ設定
 * Spring管理下のコルーチンスコープを提供
 */
@Configuration
class CoroutineScopeConfig {

    /**
     * IOディスパッチャーを使用したコルーチンスコープのビーンを提供
     * これによりSpringのBeanにコルーチンスコープを注入可能
     */
    @Bean
    fun coroutineScope(): CoroutineScope {
        return CoroutineScope(SupervisorJob() + Dispatchers.IO)
    }
}