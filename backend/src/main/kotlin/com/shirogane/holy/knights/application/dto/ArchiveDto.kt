package com.shirogane.holy.knights.application.dto

import com.shirogane.holy.knights.domain.model.*
import kotlinx.serialization.Serializable
import java.time.Instant
import java.time.format.DateTimeFormatter

/**
 * アーカイブDTO（データ転送オブジェクト）
 * HTTP APIレスポンスで使用するシリアライズ可能なデータ構造
 */
@Serializable
data class ArchiveDto(
    val id: String,
    val title: String,
    val channelId: String,
    val url: String?,
    val publishedAt: String, // ISO 8601形式の日時文字列
    val description: String? = null,
    val tags: List<String> = emptyList(),
    val duration: String? = null, // HH:MM:SS形式の動画長
    val thumbnailUrl: String? = null,
    val isMembersOnly: Boolean = false
) {
    companion object {
        /**
         * ドメインモデルからDTOへの変換
         */
        fun fromDomain(archive: Archive): ArchiveDto {
            return ArchiveDto(
                id = archive.id.value,
                title = archive.title,
                channelId = archive.channelId.value,
                url = archive.videoDetails?.url,
                publishedAt = archive.publishedAt.toString(),
                description = archive.contentDetails?.description,
                tags = archive.tags.map { it.name },
                duration = archive.videoDetails?.duration?.value,
                thumbnailUrl = archive.videoDetails?.thumbnailUrl,
                isMembersOnly = archive.contentDetails?.isMembersOnly ?: false
            )
        }
    }
}

/**
 * アーカイブ検索パラメータDTO
 */
data class ArchiveSearchParamsDto(
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
 * アーカイブ検索結果DTO
 */
@Serializable
data class ArchiveSearchResultDto(
    val items: List<ArchiveDto>,
    val totalCount: Int,
    val page: Int,
    val pageSize: Int,
    val hasMore: Boolean
)
