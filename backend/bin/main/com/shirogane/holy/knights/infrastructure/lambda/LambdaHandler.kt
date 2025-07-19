package com.shirogane.holy.knights.infrastructure.lambda

import com.shirogane.holy.knights.Application
import com.shirogane.holy.knights.infrastructure.config.DependencyInjection
import com.shirogane.holy.knights.infrastructure.database.DatabaseFactory
import org.slf4j.LoggerFactory
import kotlin.system.exitProcess

/**
 * AWS Lambda ハンドラー
 * API Gateway HTTP リクエストを処理し、Ktorアプリケーションにルーティングする
 */
class LambdaHandler {
    private val logger = LoggerFactory.getLogger(LambdaHandler::class.java)
    
    companion object {
        init {
            try {
                // データベース接続を初期化
                DatabaseFactory.init()
                
                // 依存関係を初期化
                DependencyInjection.init()
                
                // シャットダウンフックを追加
                Runtime.getRuntime().addShutdownHook(Thread {
                    try {
                        DatabaseFactory.close()
                    } catch (e: Exception) {
                        System.err.println("リソースのクローズに失敗: ${e.message}")
                    }
                })
            } catch (e: Exception) {
                System.err.println("アプリケーション初期化エラー: ${e.message}")
                e.printStackTrace()
                exitProcess(1)
            }
        }
    }
}