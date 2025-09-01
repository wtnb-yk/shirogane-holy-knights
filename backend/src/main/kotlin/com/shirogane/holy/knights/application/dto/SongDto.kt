package com.shirogane.holy.knights.application.dto

import com.shirogane.holy.knights.application.common.PageRequest
import com.shirogane.holy.knights.application.common.PaginatedResult
import com.shirogane.holy.knights.domain.model.*
import kotlinx.serialization.Serializable
import java.time.Instant

/**
 * 楽曲検索パラメータDTO
 */
data class StreamSongSearchParamsDto(
    val query: String? = null,
    val sortBy: String? = "singCount", // singCount|latestSingDate|title
    val sortOrder: String? = "DESC", // DESC|ASC
    val startDate: Instant? = null,
    val endDate: Instant? = null,
    val page: Int = 1,  
    val size: Int = 20
) {
    /**
     * PageRequestインスタンスを生成
     */
    fun toPageRequest() = PageRequest(page, size)
}

/**
 * 楽曲DTO（データ転送オブジェクト）
 */
@Serializable
data class StreamSongDto(
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
        fun fromDomain(song: Song): StreamSongDto {
            return StreamSongDto(
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
data class StreamSongSearchResultDto(
    override val items: List<StreamSongDto>,
    override val totalCount: Int,
    override val page: Int,
    override val pageSize: Int
) : PaginatedResult<StreamSongDto> {
    companion object {
        fun of(items: List<StreamSongDto>, totalCount: Int, pageRequest: PageRequest): StreamSongSearchResultDto {
            return StreamSongSearchResultDto(
                items = items,
                totalCount = totalCount,
                page = pageRequest.requestPage,
                pageSize = pageRequest.size
            )
        }
    }
}

/**
 * 楽曲統計情報DTO
 */
@Serializable
data class StreamSongStatsDto(
    val totalSongs: Int,
    val totalPerformances: Int,
    val topSongs: List<TopSongStatsDto>,
    val recentPerformances: List<RecentPerformanceStatsDto>
) {
    companion object {
        fun fromDomain(stats: SongStats): StreamSongStatsDto {
            return StreamSongStatsDto(
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