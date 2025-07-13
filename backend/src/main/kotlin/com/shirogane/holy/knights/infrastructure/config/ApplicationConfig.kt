package com.shirogane.holy.knights.infrastructure.config

import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.callloging.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.request.*
import io.ktor.server.routing.*
import kotlinx.serialization.json.Json
import org.slf4j.event.Level

/**
 * アプリケーション設定
 * Ktorのモジュール構成やプラグイン設定を行う
 */
object ApplicationConfig {
    
    /**
     * アプリケーションモジュールの設定
     * @param application Ktorアプリケーションインスタンス
     */
    fun configureApplication(application: Application) {
        // CORS設定
        configureCors(application)
        
        // コンテンツネゴシエーション設定（JSONシリアライズ）
        configureContentNegotiation(application)
        
        // ロギング設定
        configureCallLogging(application)
        
        // ルーティング設定
        configureRouting(application)
    }
    
    /**
     * CORS（クロスオリジンリソース共有）設定
     */
    private fun configureCors(application: Application) {
        application.install(CORS) {
            // フロントエンドURLを環境変数から取得、デフォルトはローカル開発用
            val frontendUrl = System.getenv("FRONTEND_URL") ?: "http://localhost:3000"
            
            allowHost(frontendUrl, schemes = listOf("http", "https"))
            allowHeader(HttpHeaders.ContentType)
            allowHeader(HttpHeaders.Authorization)
            allowMethod(HttpMethod.Get)
            allowMethod(HttpMethod.Post)
            allowMethod(HttpMethod.Put)
            allowMethod(HttpMethod.Delete)
            allowMethod(HttpMethod.Options)
            
            // 本番環境ではより厳格に設定
            if (System.getenv("ENV") == "production") {
                allowCredentials = true
                maxAgeInSeconds = 3600
            }
        }
    }
    
    /**
     * コンテンツネゴシエーション設定（JSON変換）
     */
    private fun configureContentNegotiation(application: Application) {
        application.install(ContentNegotiation) {
            json(Json {
                prettyPrint = true
                isLenient = true
                ignoreUnknownKeys = true
            })
        }
    }
    
    /**
     * ロギング設定
     */
    private fun configureCallLogging(application: Application) {
        application.install(CallLogging) {
            level = Level.INFO
            filter { call -> call.request.path().startsWith("/api") }
            format { call ->
                val status = call.response.status()
                val httpMethod = call.request.httpMethod.value
                val path = call.request.path()
                "[$status] $httpMethod $path"
            }
        }
    }
    
    /**
     * ルーティング設定
     */
    private fun configureRouting(application: Application) {
        application.routing {
            // アーカイブAPI
            route("/api/v1") {
                // DIからコントローラを取得してルート設定
                DependencyInjection.archiveController.configureRoutes(this)
            }
            
            // ヘルスチェックエンドポイント
            get("/health") {
                call.respondText("OK", ContentType.Text.Plain)
            }
        }
    }
}