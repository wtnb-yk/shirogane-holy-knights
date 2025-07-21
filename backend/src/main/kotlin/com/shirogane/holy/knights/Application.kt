package com.shirogane.holy.knights

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cloud.function.context.FunctionCatalog
import org.springframework.cloud.function.context.catalog.FunctionInspector
import org.springframework.cloud.function.context.config.ContextFunctionCatalogInitializer

/**
 * Spring Bootアプリケーション起動クラス
 */
@SpringBootApplication
class Application {
    companion object {
        /**
         * アプリケーション起動（メインエントリーポイント）
         */
        @JvmStatic
        fun main(args: Array<String>) {
            runApplication<Application>(*args) {
                // Lambda関数サポートを明示的に有効化
                addInitializers(
                    ContextFunctionCatalogInitializer(
                        FunctionCatalog::class.java,
                        FunctionInspector::class.java
                    )
                )
            }
        }
    }
}