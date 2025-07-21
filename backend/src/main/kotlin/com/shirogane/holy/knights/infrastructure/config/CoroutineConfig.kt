package com.shirogane.holy.knights.infrastructure.config

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.config.WebFluxConfigurer

/**
 * コルーチン設定
 * Spring WebFluxでのコルーチン対応の設定を行う
 * コルーチンスコープとディスパッチャーの管理を統合
 */
@Configuration
class CoroutineConfig : WebFluxConfigurer {
    
    /**
     * コルーチンディスパッチャーの初期化を確実に行う
     */
    @Bean
    fun coroutineDispatcherInitializer(): String {
        // Dispatchersの初期化を明示的に行う
        // これによりSpring環境でのコルーチンコンテキスト問題を回避
        val dispatcher = Dispatchers.IO
        return "Dispatchers initialized"
    }
    
    /**
     * IOディスパッチャーを使用したコルーチンスコープのビーンを提供
     * これによりSpringのBeanにコルーチンスコープを注入可能
     */
    @Bean
    fun coroutineScope(): CoroutineScope {
        return CoroutineScope(SupervisorJob() + Dispatchers.IO)
    }
}