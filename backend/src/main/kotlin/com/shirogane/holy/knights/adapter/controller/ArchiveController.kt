package com.shirogane.holy.knights.adapter.`in`.controller

import com.shirogane.holy.knights.application.dto.ArchiveSearchParamsDto
import com.shirogane.holy.knights.application.port.`in`.ArchiveUseCasePort
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

/**
 * アーカイブコントローラー
 * HTTPリクエストを受け付け、ユースケースに処理を委譲し、結果をレスポンスとして返す
 */
class ArchiveController(private val archiveUseCase: ArchiveUseCasePort) {

    /**
     * ルートの設定
     */
    fun configureRoutes(route: Route) {
        route.route("/archives") {
            // アーカイブ一覧を取得
            get {
                val page = call.request.queryParameters["page"]?.toIntOrNull() ?: 1
                val pageSize = call.request.queryParameters["pageSize"]?.toIntOrNull() ?: 20
                
                try {
                    val result = archiveUseCase.getAllArchives(page, pageSize)
                    call.respond(HttpStatusCode.OK, result)
                } catch (e: Exception) {
                    application.log.error("アーカイブ一覧取得エラー", e)
                    call.respond(HttpStatusCode.InternalServerError, mapOf("error" to "アーカイブ一覧の取得中にエラーが発生しました"))
                }
            }
            
            // IDによるアーカイブ詳細取得
            get("{id}") {
                val id = call.parameters["id"] ?: return@get call.respond(HttpStatusCode.BadRequest, "IDが必要です")
                
                try {
                    val archive = archiveUseCase.getArchiveById(id)
                    if (archive != null) {
                        call.respond(HttpStatusCode.OK, archive)
                    } else {
                        call.respond(HttpStatusCode.NotFound, mapOf("error" to "指定されたIDのアーカイブが見つかりません"))
                    }
                } catch (e: Exception) {
                    application.log.error("アーカイブ詳細取得エラー", e)
                    call.respond(HttpStatusCode.InternalServerError, mapOf("error" to "アーカイブ詳細の取得中にエラーが発生しました"))
                }
            }
            
            // 検索エンドポイント
            get("search") {
                val query = call.request.queryParameters["query"]
                val tags = call.request.queryParameters["tags"]?.split(",")
                val startDate = call.request.queryParameters["startDate"]
                val endDate = call.request.queryParameters["endDate"]
                val page = call.request.queryParameters["page"]?.toIntOrNull() ?: 1
                val pageSize = call.request.queryParameters["pageSize"]?.toIntOrNull() ?: 20
                
                val searchParams = ArchiveSearchParamsDto(
                    query = query,
                    tags = tags,
                    startDate = startDate,
                    endDate = endDate,
                    page = page,
                    pageSize = pageSize
                )
                
                try {
                    val result = archiveUseCase.searchArchives(searchParams)
                    call.respond(HttpStatusCode.OK, result)
                } catch (e: Exception) {
                    application.log.error("アーカイブ検索エラー", e)
                    call.respond(HttpStatusCode.InternalServerError, mapOf("error" to "アーカイブ検索中にエラーが発生しました"))
                }
            }
            
            // 関連アーカイブ取得エンドポイント
            get("{id}/related") {
                val id = call.parameters["id"] ?: return@get call.respond(HttpStatusCode.BadRequest, "IDが必要です")
                val limit = call.request.queryParameters["limit"]?.toIntOrNull() ?: 5
                
                try {
                    val relatedArchives = archiveUseCase.getRelatedArchives(id, limit)
                    call.respond(HttpStatusCode.OK, relatedArchives)
                } catch (e: Exception) {
                    application.log.error("関連アーカイブ取得エラー", e)
                    call.respond(HttpStatusCode.InternalServerError, mapOf("error" to "関連アーカイブの取得中にエラーが発生しました"))
                }
            }
        }
    }
}