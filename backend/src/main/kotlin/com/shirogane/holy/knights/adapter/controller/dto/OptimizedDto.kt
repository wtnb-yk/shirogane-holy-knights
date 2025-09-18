package com.shirogane.holy.knights.adapter.controller.dto

import com.shirogane.holy.knights.application.common.PageRequest
import com.shirogane.holy.knights.application.common.PaginatedResult
import com.shirogane.holy.knights.domain.model.*
import kotlinx.serialization.Serializable

/**
 * 最適化された動画DTO（最小限のフィールドのみ）
 * リスト表示用の軽量バージョン
 */
@Serializable
data class OptimizedVideoDto(
    val id: String,
    val title: String,
    val publishedAt: String,
    val thumbnailUrl: String? = null,
    val duration: String? = null,
    val tags: List<String> = emptyList()
) {
    companion object {
        fun fromDomain(video: Video): OptimizedVideoDto {
            return OptimizedVideoDto(
                id = video.id.value,
                title = video.title,
                publishedAt = video.publishedAt.toString(),
                thumbnailUrl = video.videoDetails?.thumbnailUrl,
                duration = video.videoDetails?.duration?.value,
                tags = video.tags.map { it.name }
            )
        }
    }
}

/**
 * 最適化された配信DTO（最小限のフィールドのみ）
 */
@Serializable
data class OptimizedStreamDto(
    val id: String,
    val title: String,
    val startedAt: String?,
    val thumbnailUrl: String? = null,
    val tags: List<String> = emptyList()
) {
    companion object {
        fun fromDomain(stream: Stream): OptimizedStreamDto {
            return OptimizedStreamDto(
                id = stream.id.value,
                title = stream.title,
                startedAt = stream.startedAt.toString(),
                thumbnailUrl = null, // 配信のサムネイルは通常不要
                tags = stream.streamTags.map { it.name }
            )
        }
    }
}

/**
 * 最適化されたニュースDTO（最小限のフィールドのみ）
 */
@Serializable
data class OptimizedNewsDto(
    val id: String,
    val title: String,
    val publishedAt: String,
    val summary: String? = null,
    val thumbnailUrl: String? = null,
    val categoryName: String? = null
) {
    companion object {
        fun fromDomain(news: News): OptimizedNewsDto {
            return OptimizedNewsDto(
                id = news.id.value,
                title = news.title,
                publishedAt = news.publishedAt.toString(),
                summary = news.content?.take(200), // 最初の200文字のみ
                thumbnailUrl = news.thumbnailUrl,
                categoryName = news.categories.firstOrNull()?.name
            )
        }
    }
}

/**
 * 最適化された楽曲DTO（最小限のフィールドのみ）
 */
@Serializable
data class OptimizedSongDto(
    val id: String,
    val title: String,
    val artist: String,
    val singCount: Int,
    val lastSungAt: String?
) {
    companion object {
        fun fromDomain(song: Song): OptimizedSongDto {
            return OptimizedSongDto(
                id = song.id.value.toString(),
                title = song.title,
                artist = song.artist,
                singCount = song.singCount,
                lastSungAt = song.latestSingDate?.toString()
            )
        }
    }
}

/**
 * 最適化された検索結果DTO（共通）
 */
@Serializable
data class OptimizedSearchResultDto<T>(
    override val items: List<T>,
    override val totalCount: Int,
    override val page: Int,
    override val pageSize: Int,
    val hasNext: Boolean,
    val hasPrevious: Boolean
) : PaginatedResult<T> {
    companion object {
        fun <T> of(items: List<T>, totalCount: Int, pageRequest: PageRequest): OptimizedSearchResultDto<T> {
            val totalPages = (totalCount + pageRequest.size - 1) / pageRequest.size
            return OptimizedSearchResultDto(
                items = items,
                totalCount = totalCount,
                page = pageRequest.requestPage,
                pageSize = pageRequest.size,
                hasNext = pageRequest.requestPage < totalPages,
                hasPrevious = pageRequest.requestPage > 1
            )
        }
    }
}