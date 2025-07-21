package com.shirogane.holy.knights.infrastructure.config

import kotlinx.coroutines.Dispatchers
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.AsyncSupportConfigurer
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

/**
 * コルーチン設定
 * Spring MVCでのコルーチン対応の設定を行う
 */
@Configuration
class CoroutineConfig : WebMvcConfigurer {
    
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
     * 非同期サポートの設定
     */
    override fun configureAsyncSupport(configurer: AsyncSupportConfigurer) {
        configurer.setDefaultTimeout(30_000) // 30秒
    }
}