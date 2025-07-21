package com.shirogane.holy.knights.infrastructure.lambda.functions

import com.shirogane.holy.knights.application.dto.ArchiveSearchParamsDto
import com.shirogane.holy.knights.application.dto.ArchiveSearchResultDto
import com.shirogane.holy.knights.application.port.`in`.ArchiveUseCasePort
import kotlinx.coroutines.runBlocking
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.util.function.Function

/**
 * アーカイブを検索するLambda関数
 *
 * AWS Lambda環境で実行され、"archiveSearch"という名前で呼び出せる関数です。
 * アーカイブの検索条件をリクエストとして受け取り、検索結果を返します。
 */
@Component("archiveSearch")
class ArchiveSearchFunction(private val archiveUseCase: ArchiveUseCasePort) : Function<ArchiveSearchRequest, ArchiveSearchResultDto> {

    private val logger = LoggerFactory.getLogger(ArchiveSearchFunction::class.java)

    /**
     * アーカイブ検索リクエストを処理し、検索結果を返します
     *
     * @param request 検索条件を含むリクエスト
     * @return 検索結果DTO
     */
    override fun apply(request: ArchiveSearchRequest): ArchiveSearchResultDto {
        logger.info("アーカイブ検索リクエスト受信: $request")
        
        val searchParams = ArchiveSearchParamsDto(
            query = request.query,
            tags = request.tags,
            startDate = request.startDate,
            endDate = request.endDate,
            page = request.page ?: 1,
            pageSize = request.pageSize ?: 20
        )
        
        // コルーチン関数を呼び出すためにrunBlockingを使用
        return runBlocking {
            try {
                archiveUseCase.searchArchives(searchParams)
            } catch (e: Exception) {
                logger.error("アーカイブ検索中にエラーが発生しました", e)
                // エラー時は空の結果を返す
                ArchiveSearchResultDto(
                    items = emptyList(),
                    totalCount = 0,
                    page = searchParams.page,
                    pageSize = searchParams.pageSize,
                    hasMore = false
                )
            }
        }
    }
}

/**
 * アーカイブ検索リクエストのデータクラス
 */
data class ArchiveSearchRequest(
    val query: String? = null,
    val tags: List<String>? = null,
    val startDate: String? = null,
    val endDate: String? = null,
    val page: Int? = null,
    val pageSize: Int? = null
)