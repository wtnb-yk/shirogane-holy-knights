package com.shirogane.holy.knights.application.dto

import com.shirogane.holy.knights.domain.model.*
import kotlinx.serialization.Serializable
import java.time.Instant
import java.time.format.DateTimeFormatter

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
    val startDate: String? = null, // ISO 8601形式の日時文字列
    val endDate: String? = null,   // ISO 8601形式の日時文字列
    val page: Int = 1,
    val pageSize: Int = 20
) {
    /**
     * startDateをInstantに変換
     */
    fun getStartDateAsInstant(): Instant? {
        return startDate?.let { Instant.parse(it) }
    }
    
    /**
     * endDateをInstantに変換
     */
    fun getEndDateAsInstant(): Instant? {
        return endDate?.let { Instant.parse(it) }
    }
    
    /**
     * オフセットを計算
     */
    fun getOffset(): Int {
        return (page - 1) * pageSize
    }
}

/**
 * 動画検索結果DTO
 */
@Serializable
data class VideoSearchResultDto(
    val items: List<VideoDto>,
    val totalCount: Int,
    val page: Int,
    val pageSize: Int,
    val hasMore: Boolean
)

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
        fun fromDomain(video: Video): StreamDto {
            return StreamDto(
                id = video.id.value,
                title = video.title,
                channelId = video.channelId.value,
                url = video.videoDetails?.url ?: "https://www.youtube.com/watch?v=${video.id.value}",
                startedAt = video.streamDetails?.startedAt?.toString(),
                description = video.contentDetails?.description,
                tags = video.tags.map { it.name },
                duration = video.videoDetails?.duration?.value,
                thumbnailUrl = video.videoDetails?.thumbnailUrl,
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
    val startDate: String? = null, // ISO 8601形式の日時文字列
    val endDate: String? = null,   // ISO 8601形式の日時文字列
    val page: Int = 1,
    val pageSize: Int = 20
) {
    /**
     * startDateをInstantに変換
     */
    fun getStartDateAsInstant(): Instant? {
        return startDate?.let { Instant.parse(it) }
    }
    
    /**
     * endDateをInstantに変換
     */
    fun getEndDateAsInstant(): Instant? {
        return endDate?.let { Instant.parse(it) }
    }
    
    /**
     * オフセットを計算
     */
    fun getOffset(): Int {
        return (page - 1) * pageSize
    }
}

/**
 * 配信検索結果DTO
 */
@Serializable
data class StreamSearchResultDto(
    val items: List<StreamDto>,
    val totalCount: Int,
    val page: Int,
    val pageSize: Int,
    val hasMore: Boolean
)
