package com.shirogane.holy.knights

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

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
            runApplication<Application>(*args)
        }
    }
}