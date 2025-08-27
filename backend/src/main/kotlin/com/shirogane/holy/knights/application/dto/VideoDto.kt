package com.shirogane.holy.knights.application.dto

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
    val startDate: String? = null, // ISO 8601形式の日時文字列
    val endDate: String? = null,   // ISO 8601形式の日時文字列
    val page: Int = 1,  
    val pageSize: Int = 20
) {
    /**
     * PageRequestインスタンスを生成
     */
    fun toPageRequest() = com.shirogane.holy.knights.application.common.PageRequest(page, pageSize)
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
     * PageRequestインスタンスを生成
     */
    fun toPageRequest() = com.shirogane.holy.knights.application.common.PageRequest(page, pageSize)
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

/**
 * 楽曲検索パラメータDTO
 */
data class PerformedSongSearchParamsDto(
    val query: String? = null,
    val sortBy: String? = "singCount", // singCount|latestSingDate|title
    val sortOrder: String? = "DESC", // DESC|ASC
    val page: Int = 1,  
    val size: Int = 20
) {
    /**
     * PageRequestインスタンスを生成
     */
    fun toPageRequest() = com.shirogane.holy.knights.application.common.PageRequest(page, size)
}

/**
 * 楽曲DTO（データ転送オブジェクト）
 */
@Serializable
data class PerformedSongDto(
    val id: String,
    val title: String,
    val artist: String,
    val singCount: Int,
    val latestSingDate: String?, // ISO 8601形式の日時文字列
    val performances: List<PerformanceDto> = emptyList()
) {
    companion object {
        /**
         * ドメインモデルからDTOへの変換
         */
        fun fromDomain(song: Song): PerformedSongDto {
            return PerformedSongDto(
                id = song.id.value.toString(),
                title = song.title,
                artist = song.artist,
                singCount = song.singCount,
                latestSingDate = song.latestSingDate?.toString(),
                performances = song.performances.map { PerformanceDto.fromDomain(it) }
            )
        }
    }
}

/**
 * パフォーマンスDTO
 */
@Serializable
data class PerformanceDto(
    val videoId: String,
    val videoTitle: String,
    val performanceType: String, // STREAM|CONCERT
    val url: String,
    val startSeconds: Int,
    val performedAt: String, // ISO 8601形式の日時文字列
    val streamSongUrl: String // YouTubeの特定時間へのリンク
) {
    companion object {
        fun fromDomain(performance: Performance): PerformanceDto {
            return PerformanceDto(
                videoId = performance.videoId.value,
                videoTitle = performance.videoTitle,
                performanceType = performance.performanceType.name,
                url = performance.url,
                startSeconds = performance.startSeconds,
                performedAt = performance.performedAt.toString(),
                streamSongUrl = performance.streamSongUrl
            )
        }
    }
}

/**
 * 楽曲検索結果DTO
 */
@Serializable
data class PerformedSongSearchResultDto(
    val songs: List<PerformedSongDto>,
    val totalCount: Int,
    val totalPages: Int,
    val currentPage: Int
)

/**
 * 楽曲統計情報DTO
 */
@Serializable
data class PerformedSongStatsDto(
    val totalSongs: Int,
    val totalPerformances: Int,
    val topSongs: List<TopSongStatsDto>,
    val recentPerformances: List<RecentPerformanceStatsDto>
) {
    companion object {
        fun fromDomain(stats: SongStats): PerformedSongStatsDto {
            return PerformedSongStatsDto(
                totalSongs = stats.totalSongs,
                totalPerformances = stats.totalPerformances,
                topSongs = stats.topSongs.map { TopSongStatsDto.fromDomain(it) },
                recentPerformances = stats.recentPerformances.map { RecentPerformanceStatsDto.fromDomain(it) }
            )
        }
    }
}

/**
 * 上位楽曲統計DTO
 */
@Serializable
data class TopSongStatsDto(
    val songId: String,
    val title: String,
    val artist: String,
    val singCount: Int
) {
    companion object {
        fun fromDomain(topSong: TopSongStats): TopSongStatsDto {
            return TopSongStatsDto(
                songId = topSong.songId.value.toString(),
                title = topSong.title,
                artist = topSong.artist,
                singCount = topSong.singCount
            )
        }
    }
}

/**
 * 最新歌唱統計DTO
 */
@Serializable
data class RecentPerformanceStatsDto(
    val songId: String,
    val title: String,
    val artist: String,
    val latestPerformance: String, // ISO 8601形式の日時文字列
    val latestVideoId: String,
    val latestVideoTitle: String,
    val latestVideoUrl: String
) {
    companion object {
        fun fromDomain(recentPerformance: RecentPerformanceStats): RecentPerformanceStatsDto {
            return RecentPerformanceStatsDto(
                songId = recentPerformance.songId.value.toString(),
                title = recentPerformance.title,
                artist = recentPerformance.artist,
                latestPerformance = recentPerformance.latestPerformance.toString(),
                latestVideoId = recentPerformance.latestVideoId.value,
                latestVideoTitle = recentPerformance.latestVideoTitle,
                latestVideoUrl = recentPerformance.latestVideoUrl
            )
        }
    }
}
