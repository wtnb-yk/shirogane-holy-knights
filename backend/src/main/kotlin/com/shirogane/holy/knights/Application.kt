package com.shirogane.holy.knights

import com.shirogane.holy.knights.infrastructure.config.ApplicationConfig
import com.shirogane.holy.knights.infrastructure.database.DatabaseFactory
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*

/**
 * メインアプリケーションクラス
 */
class Application {
    companion object {
        /**
         * アプリケーション作成
         * Ktor設定とアプリケーションモジュールを構成
         */
        fun create(): Application {
            // エンジン設定
            val engine = embeddedServer(Netty, port = 8080, host = "0.0.0.0") {
                // アプリケーション設定を適用
                ApplicationConfig.configureApplication(this)
            }
            
            // サーバー起動
            engine.start(wait = false)
            
            return Application()
        }
        
        /**
         * アプリケーション起動（ローカル開発用）
         */
        @JvmStatic
        fun main(args: Array<String>) {
            // データベース接続を初期化
            DatabaseFactory.init()
            
            // エンジン設定
            val engine = embeddedServer(Netty, port = 8080, host = "0.0.0.0") {
                // アプリケーション設定を適用
                ApplicationConfig.configureApplication(this)
            }
            
            // サーバー起動（待機）
            engine.start(wait = true)
        }
    }
}