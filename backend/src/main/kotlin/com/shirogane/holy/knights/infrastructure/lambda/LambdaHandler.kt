package com.shirogane.holy.knights.infrastructure.lambda

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.RequestHandler
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent
import com.shirogane.holy.knights.Application
import com.shirogane.holy.knights.infrastructure.config.DependencyInjection
import com.shirogane.holy.knights.infrastructure.database.DatabaseFactory
import io.ktor.server.application.*
import io.ktor.server.plugins.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.util.*
import org.slf4j.LoggerFactory
import java.io.ByteArrayOutputStream
import java.io.PrintWriter
import kotlin.system.exitProcess

/**
 * AWS Lambda ハンドラー
 * API Gateway HTTP リクエストを処理し、Ktorアプリケーションにルーティングする
 */
class LambdaHandler : RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    private val logger = LoggerFactory.getLogger(LambdaHandler::class.java)
    private val application = Application.create()
    
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
    
    /**
     * Lambda関数ハンドラー
     * API Gatewayからのリクエストを処理し、レスポンスを返す
     */
    override fun handleRequest(input: APIGatewayProxyRequestEvent, context: Context): APIGatewayProxyResponseEvent {
        logger.debug("Lambdaリクエスト受信: ${input.httpMethod} ${input.path}")
        
        try {
            // KtorアプリケーションにリクエストをルーティングするためのCallオブジェクトを作成
            val ktorRequest = createKtorRequest(input)
            val ktorResponse = processKtorRequest(ktorRequest)
            
            // Ktorレスポンスを変換してAPIGatewayレスポンスを作成
            return APIGatewayProxyResponseEvent()
                .withStatusCode(ktorResponse.status.value)
                .withHeaders(ktorResponse.headers)
                .withBody(ktorResponse.body)
                .withIsBase64Encoded(ktorResponse.isBase64Encoded)
                
        } catch (e: Exception) {
            logger.error("リクエスト処理中にエラーが発生しました", e)
            
            val errorOutput = ByteArrayOutputStream()
            e.printStackTrace(PrintWriter(errorOutput))
            val stackTrace = errorOutput.toString()
            
            return APIGatewayProxyResponseEvent()
                .withStatusCode(500)
                .withBody("{'error': 'Internal Server Error', 'details': '${e.message}'}")
                .withHeaders(mapOf("Content-Type" to "application/json"))
        }
    }
    
    /**
     * API GatewayリクエストをKtorリクエストに変換
     */
    private fun createKtorRequest(input: APIGatewayProxyRequestEvent): KtorRequest {
        return KtorRequest(
            method = io.ktor.http.HttpMethod.parse(input.httpMethod),
            uri = input.path,
            headers = input.headers ?: emptyMap(),
            queryParameters = input.queryStringParameters ?: emptyMap(),
            body = input.body ?: "",
            isBase64Encoded = input.isBase64Encoded ?: false
        )
    }
    
    /**
     * Ktorリクエストを処理し、レスポンスを返す
     */
    private fun processKtorRequest(request: KtorRequest): KtorResponse {
        val response = KtorResponse()
        
        application.environment.monitor.raise(ApplicationStarted, application)
        
        try {
            val pipeline = application.plugin(RoutingPlugin).resolve(
                ApplicationCall(
                    application,
                    request,
                    response,
                    null,
                    false
                )
            )
            
            pipeline.execute(request, response)
        } catch (e: Exception) {
            logger.error("Ktorルーティング処理中にエラーが発生しました", e)
            response.status = io.ktor.http.HttpStatusCode.InternalServerError
            response.headers = mapOf("Content-Type" to "application/json")
            response.body = "{'error': 'Internal Server Error'}"
        }
        
        return response
    }
    
    /**
     * Ktorリクエスト
     */
    private data class KtorRequest(
        val method: io.ktor.http.HttpMethod,
        val uri: String,
        val headers: Map<String, String>,
        val queryParameters: Map<String, String>,
        val body: String,
        val isBase64Encoded: Boolean
    ) : ApplicationRequest {
        // Ktorリクエスト実装（簡略化）
        // 実際の実装ではさらに多くのメソッドを適切に実装する必要がある
        override val call: ApplicationCall
            get() = TODO("Not yet implemented")
        
        override val local: RequestConnectionPoint
            get() = TODO("Not yet implemented")
        
        override val cookies: RequestCookies
            get() = TODO("Not yet implemented")
        
        override val headers: io.ktor.http.Headers
            get() = TODO("Not yet implemented")
        
        override val origin: Any
            get() = TODO("Not yet implemented")
        
        override val pipeline: ApplicationReceivePipeline
            get() = TODO("Not yet implemented")
    }
    
    /**
     * Ktorレスポンス
     */
    private data class KtorResponse(
        var status: io.ktor.http.HttpStatusCode = io.ktor.http.HttpStatusCode.OK,
        var headers: Map<String, String> = emptyMap(),
        var body: String = "",
        var isBase64Encoded: Boolean = false
    ) : ApplicationResponse {
        // Ktorレスポンス実装（簡略化）
        // 実際の実装ではさらに多くのメソッドを適切に実装する必要がある
        override val call: ApplicationCall
            get() = TODO("Not yet implemented")
        
        override val cookies: ResponseCookies
            get() = TODO("Not yet implemented")
        
        override val headers: io.ktor.http.Headers
            get() = TODO("Not yet implemented")
        
        override val pipeline: ApplicationSendPipeline
            get() = TODO("Not yet implemented")
        
        override fun push(builder: ResponsePushBuilder) {
            TODO("Not yet implemented")
        }
        
        override suspend fun respondOutgoingContent(content: OutgoingContent) {
            TODO("Not yet implemented")
        }
    }
}