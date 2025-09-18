package com.shirogane.holy.knights.infrastructure.lambda

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent
import com.fasterxml.jackson.databind.ObjectMapper
import com.shirogane.holy.knights.adapter.controller.error.ErrorResponse
import org.springframework.stereotype.Component
import java.time.Instant
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import java.util.zip.GZIPOutputStream
import java.io.ByteArrayOutputStream
import java.nio.charset.StandardCharsets

/**
 * 最適化されたAPI Gateway レスポンスビルダー
 * キャッシュヘッダー、圧縮、レスポンス最適化機能を提供
 */
@Component
class ApiGatewayResponseBuilder(
    private val objectMapper: ObjectMapper
) {
    
    companion object {
        private val HTTP_DATE_FORMAT = DateTimeFormatter.RFC_1123_DATE_TIME
        private const val COMPRESSION_THRESHOLD = 1024 // 1KB以上で圧縮
    }
    
    /**
     * 成功レスポンス（キャッシュ対応）
     */
    fun success(body: Any, cacheMaxAge: Int = 300): APIGatewayProxyResponseEvent {
        val jsonBody = objectMapper.writeValueAsString(body)
        val headers = buildOptimizedHeaders(jsonBody, cacheMaxAge)
        val responseBody = compressIfNeeded(jsonBody, headers)
        
        return APIGatewayProxyResponseEvent()
            .withStatusCode(200)
            .withHeaders(headers)
            .withBody(responseBody)
            .withIsBase64Encoded(headers.containsKey("Content-Encoding"))
    }
    
    /**
     * 長期キャッシュ対応の成功レスポンス（静的データ用）
     */
    fun successWithLongCache(body: Any, cacheMaxAge: Int = 3600): APIGatewayProxyResponseEvent {
        return success(body, cacheMaxAge)
    }
    
    /**
     * キャッシュなしの成功レスポンス（動的データ用）
     */
    fun successNoCache(body: Any): APIGatewayProxyResponseEvent {
        val jsonBody = objectMapper.writeValueAsString(body)
        val headers = buildNoCacheHeaders(jsonBody)
        val responseBody = compressIfNeeded(jsonBody, headers)
        
        return APIGatewayProxyResponseEvent()
            .withStatusCode(200)
            .withHeaders(headers)
            .withBody(responseBody)
            .withIsBase64Encoded(headers.containsKey("Content-Encoding"))
    }
    
    fun badRequest(message: String = "Bad Request"): APIGatewayProxyResponseEvent {
        val errorBody = mapOf("error" to message, "timestamp" to Instant.now().toString())
        return APIGatewayProxyResponseEvent()
            .withStatusCode(400)
            .withHeaders(buildErrorHeaders())
            .withBody(objectMapper.writeValueAsString(errorBody))
    }
    
    fun notFound(): APIGatewayProxyResponseEvent {
        val errorBody = mapOf("error" to "Not Found", "timestamp" to Instant.now().toString())
        return APIGatewayProxyResponseEvent()
            .withStatusCode(404)
            .withHeaders(buildErrorHeaders())
            .withBody(objectMapper.writeValueAsString(errorBody))
    }
    
    fun error(statusCode: Int = 500, message: String = "Internal Server Error"): APIGatewayProxyResponseEvent {
        val errorBody = mapOf("error" to message, "timestamp" to Instant.now().toString())
        return APIGatewayProxyResponseEvent()
            .withStatusCode(statusCode)
            .withHeaders(buildErrorHeaders())
            .withBody(objectMapper.writeValueAsString(errorBody))
    }
    
    fun errorResponse(statusCode: Int, errorResponse: ErrorResponse): APIGatewayProxyResponseEvent {
        return APIGatewayProxyResponseEvent()
            .withStatusCode(statusCode)
            .withHeaders(buildErrorHeaders())
            .withBody(objectMapper.writeValueAsString(errorResponse))
    }
    
    /**
     * 最適化されたヘッダーを構築（キャッシュ対応）
     */
    private fun buildOptimizedHeaders(body: String, cacheMaxAge: Int): MutableMap<String, String> {
        val now = Instant.now()
        val expires = now.plusSeconds(cacheMaxAge.toLong())
        
        return mutableMapOf(
            "Content-Type" to "application/json; charset=utf-8",
            "Cache-Control" to "public, max-age=$cacheMaxAge, s-maxage=$cacheMaxAge",
            "Expires" to expires.atOffset(ZoneOffset.UTC).format(HTTP_DATE_FORMAT),
            "Last-Modified" to now.atOffset(ZoneOffset.UTC).format(HTTP_DATE_FORMAT),
            "ETag" to "\"${body.hashCode()}\"",
            "Vary" to "Accept-Encoding",
            "X-Content-Type-Options" to "nosniff",
            "X-Frame-Options" to "DENY"
        )
    }
    
    /**
     * キャッシュなしヘッダーを構築
     */
    private fun buildNoCacheHeaders(body: String): MutableMap<String, String> {
        return mutableMapOf(
            "Content-Type" to "application/json; charset=utf-8",
            "Cache-Control" to "no-cache, no-store, must-revalidate",
            "Pragma" to "no-cache",
            "Expires" to "0",
            "Vary" to "Accept-Encoding",
            "X-Content-Type-Options" to "nosniff",
            "X-Frame-Options" to "DENY"
        )
    }
    
    /**
     * エラーレスポンス用ヘッダー
     */
    private fun buildErrorHeaders(): Map<String, String> {
        return mapOf(
            "Content-Type" to "application/json; charset=utf-8",
            "Cache-Control" to "no-cache, no-store, must-revalidate",
            "X-Content-Type-Options" to "nosniff",
            "X-Frame-Options" to "DENY"
        )
    }
    
    /**
     * 必要に応じてレスポンスを圧縮
     */
    private fun compressIfNeeded(body: String, headers: MutableMap<String, String>): String {
        val bodyBytes = body.toByteArray(StandardCharsets.UTF_8)
        
        // 圧縮閾値未満の場合は圧縮しない
        if (bodyBytes.size < COMPRESSION_THRESHOLD) {
            headers["Content-Length"] = bodyBytes.size.toString()
            return body
        }
        
        // GZIP圧縮を実行
        val compressedBytes = compressGzip(bodyBytes)
        
        // 圧縮効果が低い場合は元のデータを使用
        if (compressedBytes.size >= bodyBytes.size * 0.9) {
            headers["Content-Length"] = bodyBytes.size.toString()
            return body
        }
        
        // 圧縮されたデータを使用
        headers["Content-Encoding"] = "gzip"
        headers["Content-Length"] = compressedBytes.size.toString()
        
        // Base64エンコードして返す
        return java.util.Base64.getEncoder().encodeToString(compressedBytes)
    }
    
    /**
     * GZIP圧縮を実行
     */
    private fun compressGzip(data: ByteArray): ByteArray {
        val outputStream = ByteArrayOutputStream()
        GZIPOutputStream(outputStream).use { gzipStream ->
            gzipStream.write(data)
        }
        return outputStream.toByteArray()
    }
}
