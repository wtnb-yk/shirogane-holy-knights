package com.shirogane.holy.knights

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cloud.function.context.FunctionCatalog
import org.springframework.cloud.function.context.config.ContextFunctionCatalogInitializer

@SpringBootApplication
class Application {
    companion object {
        @JvmStatic
        fun main(args: Array<String>) {
            runApplication<Application>(*args) {
                // Lambda関数サポートを明示的に有効化
                addInitializers(
                    ContextFunctionCatalogInitializer()
                )
            }
        }
    }
}