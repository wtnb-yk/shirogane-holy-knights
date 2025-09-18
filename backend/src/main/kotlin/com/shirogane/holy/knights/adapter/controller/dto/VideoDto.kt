package com.shirogane.holy.knights.adapter.controller.dto

import com.shirogane.holy.knights.application.common.PageRequest
import com.shirogane.holy.knights.application.common.PaginatedResult
import com.shirogane.holy.knights.domain.model.*
import kotlinx.serialization.Serializable
import java.time.Instant

/**
 * 動画DTO（データ転送オブジェクト）
 * HTTP APIレスポンスで使用するシリアライズ可能なデータ構造
 */
@Serializable
data class VideoDto(
    val id: String,
    val title: String,
    val channelId: String,
    val url: String,
    val publishedAt: String, // ISO 8601形式の日時文字列
    val description: String? = null,
    val tags: List<String> = emptyList(),
    val duration: String? = null, // HH:MM:SS形式の動画長
    val thumbnailUrl: String? = null,
) {
    companion object {
        /**
         * ドメインモデルからDTOへの変換
         */
        fun fromDomain(video: Video): VideoDto {
            return VideoDto(
                id = video.id.value,
                title = video.title,
                channelId = video.channelId.value,
                url = video.videoDetails?.url ?: "https://www.youtube.com/watch?v=${video.id.value}",
                publishedAt = video.publishedAt.toString(),
                description = video.contentDetails?.description,
                tags = video.tags.map { it.name },
                duration = video.videoDetails?.duration?.value,
                thumbnailUrl = video.videoDetails?.thumbnailUrl,
            )
        }
    }
}

/**
 * 動画検索パラメータDTO
 */
data class VideoSearchParamsDto(
    val query: String? = null,
    val tags: List<String>? = null,
    val startDate: Instant? = null,
    val endDate: Instant? = null,
    val page: Int = 1,  
    val pageSize: Int = 20
) {
    /**
     * PageRequestインスタンスを生成
     */
    fun toPageRequest() = PageRequest(page, pageSize)
}

/**
 * 動画検索結果DTO
 */
@Serializable
data class VideoSearchResultDto(
    override val items: List<VideoDto>,
    override val totalCount: Int,
    override val page: Int,
    override val pageSize: Int
) : PaginatedResult<VideoDto> {
    companion object {
        fun of(items: List<VideoDto>, totalCount: Int, pageRequest: PageRequest): VideoSearchResultDto =
            VideoSearchResultDto(
                items = items,
                totalCount = totalCount,
                page = pageRequest.requestPage,
                pageSize = pageRequest.size
            )
        }
    }

/**
 * 配信DTO（データ転送オブジェクト）
 * HTTP APIレスポンスで使用するシリアライズ可能なデータ構造
 */
@Serializable
data class StreamDto(
    val id: String,
    val title: String,
    val channelId: String,
    val url: String,
    val startedAt: String?, // ISO 8601形式の配信開始日時文字列
    val description: String? = null,
    val tags: List<String> = emptyList(),
    val duration: String? = null, // HH:MM:SS形式の動画長
    val thumbnailUrl: String? = null,
) {
    companion object {
        /**
         * ドメインモデルからDTOへの変換
         */
        fun fromDomain(stream: Stream): StreamDto {
            return StreamDto(
                id = stream.id.value,
                title = stream.title,
                channelId = stream.channelId.value,
                url = stream.streamDetails?.url ?: "https://www.youtube.com/watch?v=${stream.id.value}",
                startedAt = stream.startedAt.toString(),
                description = stream.contentDetails?.description,
                tags = stream.streamTags.map { it.name },
                duration = stream.streamDetails?.duration?.value,
                thumbnailUrl = stream.streamDetails?.thumbnailUrl,
            )
        }
    }
}

/**
 * 配信検索パラメータDTO
 */
data class StreamSearchParamsDto(
    val query: String? = null,
    val tags: List<String>? = null,
    val startDate: Instant? = null,
    val endDate: Instant? = null,
    val page: Int = 1,  
    val pageSize: Int = 20
) {
    /**
     * PageRequestインスタンスを生成
     */
    fun toPageRequest() = PageRequest(page, pageSize)
}

/**
 * 配信検索結果DTO
 */
@Serializable
data class StreamSearchResultDto(
    override val items: List<StreamDto>,
    override val totalCount: Int,
    override val page: Int,
    override val pageSize: Int
) : PaginatedResult<StreamDto> {
    companion object {
        fun of(items: List<StreamDto>, totalCount: Int, pageRequest: PageRequest): StreamSearchResultDto {
            return StreamSearchResultDto(
                items = items,
                totalCount = totalCount,
                page = pageRequest.requestPage,
                pageSize = pageRequest.size
            )
        }
    }
}

